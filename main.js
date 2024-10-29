"use strict";

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");

const express = require("express");
const { WebServer } = require("@iobroker/webserver");

const xml = require("xml2js");

//Geräte
const Lex10 = require("./js/Lex10.js");
const LexPlus10SL = require("./js/LexPlus10SL.js");

class Syrconnect extends utils.Adapter {
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: "syrconnect",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		this.on("unload", this.onUnload.bind(this));

		this.devicesMap = new Map();

		this.xmlStart = '<?xml version="1.0" encoding="utf-8"?><sc version="1.0"><d>';
		this.xmlEnd = "</d></sc>";
		this.basicC = ["getSRN", "getVER", "getTYP", "getCNA"];

		this.rpwFixStates = {
			"0000000": "NN",
			"0000001": "Mo",
			"0000010": "Di",
			"0000100": "Mi",
			"0001000": "Do",
			"0010000": "Fr",
			"0100000": "Sa",
			1000000: "So",
		};

		this.server = null;
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		this.setState("info.connection", false, true);
		this.initWebServer(this.config);
	}

	getPermutations(list, maxLen) {
		// Copy initial values as arrays
		const perm = list.map(function (val) {
			return [val];
		});
		// Our permutation generator
		const generate = function (perm, maxLen, currLen) {
			// Reached desired length
			if (currLen === maxLen) {
				return perm;
			}
			// For each existing permutation
			for (let i = 0, len = perm.length; i < len; i++) {
				const currPerm = perm.shift();
				// Create new permutation
				for (let k = 0; k < list.length; k++) {
					perm.push(currPerm.concat(list[k]));
				}
			}
			// Recurse
			return generate(perm, maxLen, currLen + 1);
		};
		// Start with size 1 because of initial values
		return generate(perm, maxLen, 1);
	}

	getBinary(arr) {
		let bin = "";
		for (let i = 0; i < arr.length; i++) {
			bin += arr[i];
		}

		return bin;
	}
	/**
	 * Wird aus createObjectWithState aufgerufen, weil die Funktion in meta für getRPW eingetragen ist.
	 * Die möglichen Werte werden wie folgt ermittelt:
	 * - Basis sind alle 7stelligen Permutationen von 0 und 1. Daraus ergeben sich also Binärzahlen der Form 0000001
	 * - Jede 1 steht je nach Position in der Binärzahl für einen Wochentag
	 * - Mehrere Einsen bedeuten dann eine Kombination aus mehreren Tagen
	 * - 0000010 = 2 = Dienstag
	 * - 0000011 = 3 = Montag und Dienstag
	 * - 0000100 = 4 = Mittworch
	 * @returns
	 */

	createRPWStates() {
		const ret = {};
		const res = this.getPermutations([0, 1], 7);
		for (let i = 0; i < res.length; i++) {
			const bin = this.getBinary(res[i]);
			//Unbekannte States hinzugügen
			// eslint-disable-next-line no-prototype-builtins
			if (!this.rpwFixStates.hasOwnProperty(bin) && (bin.match(/1/g) || []).length > 1) {
				const tmpArr = [];
				const tmp = new Array(res[i].length).fill(0);
				//Ermittelt die Position der Einsen, um damit die fixen Tage zu ermitteln
				for (let l = 0; l < res[i].length; l++) {
					if (res[i][l] == 1) {
						tmp[l] = 1;
						tmpArr.unshift(this.rpwFixStates[this.getBinary(tmp)]);
						tmp.fill(0);
					}
				}

				this.rpwFixStates[bin] = tmpArr.join(";");
			}
			//Dezimalzahlen sind die neuen Keys
			ret[parseInt(bin, 2)] = this.rpwFixStates[bin];
		}

		return ret;
	}

	async createObjectWithState(dev, name, value) {
		let obj;
		const dp = dev[name];
		const id = dev.name + "." + dev.id + "." + name;
		//String
		if (dp.type == "string") {
			obj = {
				_id: id,
				type: "state",
				common: {
					name: dp.label,
					type: dp.type,
					role: "value",
					read: true,
					write: dp.writable,
				},
				native: {},
			};
			//Number
		} else if (dp.type == "number") {
			obj = {
				_id: id,
				type: "state",
				common: {
					name: dp.label,
					type: dp.type,
					unit: dp.unit,
					min: dp.min,
					max: dp.max,
					def: dp.def,
					role: "value",
					read: true,
					write: dp.writable,
				},
				native: {},
			};

			if (dp.states) {
				if (dp.states instanceof Object) {
					obj.common.states = dp.states;
				} else {
					obj.common.states = eval("this." + dp.states);
				}
			}

			//Boolean
		} else if (dp.type == "boolean") {
			obj = {
				_id: id,
				type: "state",
				common: {
					name: dp.label,
					type: dp.type,
					def: dp.def,
					role: "switch",
					read: true,
					write: dp.writable,
				},
				native: {},
			};
		}

		try {
			//Objekt erstellen
			// @ts-ignore
			await this.setObjectNotExistsAsync(obj._id, obj);

			//Value setzen
			// @ts-ignore
			this.setState(obj._id, value, true);

			// @ts-ignore
			this.log.debug("Object created: " + this.namespace + "." + obj._id);
		} catch (e) {
			// @ts-ignore
			this.log.error("Object " + obj._id + " error on creation: " + e.message);
		}
	}

	getXmlBasicC() {
		let ret = "";
		this.basicC.forEach((c) => (ret += '<c n="' + c + '" v=""/>'));
		return ret;
	}

	getXmlAllC(device) {
		let ret = "";

		if (device) {
			for (const key in device) {
				if (key.startsWith("get")) {
					//Wenn der Datenpunkt geändert wurde, muss im Response-XML eine Zeile mit dem set statt get und dem
					//neuen Value hinzugefügt werden.
					if (device.changed.has(key)) {
						ret += '<c n="' + key.replace(/get/g, "set") + '" v="' + device.changed.get(key) + '"/>';
						device.changed.delete(key);
					}

					ret += '<c n="' + key + '" v=""/>';
				}
			}
		}

		return ret;
	}

	async initWebServer(settings) {
		this.server = null;
		const app = express();

		// for parsing application/x-www-form-urlencoded
		app.use(express.urlencoded({ extended: true }));

		app.post("/WebServices/SyrConnectLimexWebService.asmx/GetBasicCommands", (req, res) => {
			this.basicCommands(req, res);
		});
		app.post("/GetBasicCommands", (req, res) => {
			this.basicCommands(req, res);
		});

		app.post("/WebServices/SyrConnectLimexWebService.asmx/GetAllCommands", (req, res) => {
			this.allCommands(req, res);
		});
		app.post("/GetAllCommands", (req, res) => {
			this.allCommands(req, res);
		});

		const webServer = new WebServer({ app: app, adapter: this, secure: false });
		const server = await webServer.init();

		server.listen(parseInt(settings.webport, 10) || 8090, settings.host, () => {
			this.log.info("Webserver started listening on " + settings.host + ":" + settings.webport);
			this.server = server;
			this.setState("info.connection", true, true);
		});

		server.on("error", (e) => {
			//https://stackoverflow.com/questions/9164915/node-js-eacces-error-when-listening-on-most-ports
			if (e.toString().includes("EACCES") && settings.webport <= 1024) {
				this.log.error(
					`node.js process has no rights to start server on the port ${settings.webport}.\n` +
						`Do you know that on linux you need special permissions for ports under 1024?\n`,
				);
			} else if (e.toString().includes("EADDRINUSE")) {
				this.log.error(
					`Cannot start server on ${settings.host}:${settings.webport}: Port is in use. Please configure another in instance settings`,
				);
			} else {
				this.log.error(`Cannot start server on ${settings.host}:${settings.webport}: ${e}`);
			}

			this.terminate
				? this.terminate(utils.EXIT_CODES.ADAPTER_REQUESTED_TERMINATION)
				: process.exit(utils.EXIT_CODES.ADAPTER_REQUESTED_TERMINATION);
		});
	}

	basicCommands(req, res) {
		this.log.debug(req.path);

		res.set("Content-Type", "text/xml");
		res.send(this.xmlStart + this.getXmlBasicC() + this.xmlEnd);
	}

	allCommands(req, res) {
		this.log.debug(req.path + ": " + req.body.xml);

		const _this = this;
		xml.parseStringPromise(req.body.xml)
			.then(async function (result) {
				const json = result.sc.d[0].c;

				const device = await _this.getDevice(json);
				if (device) {
					for (let i = 0; i < json.length; i++) {
						const id = json[i].$.n;

						const newVal = device.convertToGUI(id, json[i].$.v);

						//Objekte erzeugen und Values setzen, wenn es sich um neue Daten handelt
						const knownObj = await _this.getObjectAsync(device.name + "." + device.id + "." + id);
						if (!knownObj) {
							await _this.createObjectWithState(device, id, newVal);
						} else {
							//Bei bekannten Objekten, den Status bei Bedarf aktualisieren
							const state = await _this.getStateAsync(device.name + "." + device.id + "." + id);
							if (state) {
								const oldVal = state.val;
								if ((state.ack && oldVal != newVal) || (!state.ack && oldVal == newVal)) {
									_this.setState(device.name + "." + device.id + "." + id, newVal, true);
								}
							}
						}
					}

					//Event für Statusänderungen für alle Objekte des Adapters registrieren
					_this.subscribeStates("*");
				}

				//Response senden
				res.set("Content-Type", "text/xml");
				const responseXml = _this.xmlStart + _this.getXmlAllC(device) + _this.xmlEnd;
				res.send(responseXml);

				_this.log.debug("Response: " + responseXml);
			})
			.catch(function (err) {
				_this.log.error(err);
			});
	}

	async getDevice(json) {
		let name,
			ser = "";
		for (let i = 0; i < json.length; i++) {
			const id = json[i].$.n;
			if (id == "getCNA") {
				name = json[i].$.v.toLowerCase();
			}
			if (id == "getSRN") {
				ser = json[i].$.v.toLowerCase();
			}
			if (name && ser) {
				//Device erzeugen und speichern
				if (!this.devicesMap.has(ser)) {
					if (name.toLowerCase() == "lex10") {
						this.devicesMap.set(ser, new Lex10(ser, name));
					} else if (name.toLowerCase() == "lex10plus10sl") {
						this.devicesMap.set(ser, new LexPlus10SL(ser, name));
					}
				}
				break;
			}
		}

		return this.devicesMap.get(ser);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// @ts-ignore
			this.server.close();

			callback();
		} catch (e) {
			this.log.debug("Exception while unload: " + e);
			callback();
		}
	}

	/**
	 * Is called if a subscribed state changes
	 * @param {string} oid
	 * @param {ioBroker.State | null | undefined} state
	 */
	async onStateChange(oid, state) {
		// The state was changed by GUI
		if (state && !state.ack) {
			let val = state.val;
			this.log.debug("state " + oid + " changed: " + val + " (ack = " + state.ack + ")");

			//Änderungen für Response merken
			const arr = oid.split(".");
			oid = arr[arr.length - 1];

			const device = this.devicesMap.get(arr[arr.length - 2]);
			val = device.convertFromGUI(oid, val);
			device.changed.set(oid, val);
		}
	}
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Syrconnect(options);
} else {
	// otherwise start the instance directly
	new Syrconnect();
}
