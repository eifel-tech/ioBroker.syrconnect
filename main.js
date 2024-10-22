"use strict";

/*
 * Created with @iobroker/create-adapter v1.31.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const adapterName = require("./package.json").name.split(".").pop();

const express = require("express");
const xml = require("xml2js");

//Geräte
const Lex10 = require("./js/Lex10.js");

const devicesMap = new Map();

const xmlStart = '<?xml version="1.0" encoding="utf-8"?><sc version="1.0"><d>';
const xmlEnd = "</d></sc>";
const basicC = ["getSRN", "getVER", "getTYP", "getCNA"];

const rpwFixStates = {
	"0000000": "NN",
	"0000001": "Mo",
	"0000010": "Di",
	"0000100": "Mi",
	"0001000": "Do",
	"0010000": "Fr",
	"0100000": "Sa",
	"1000000": "So",
};

let server;

/**
 * The adapter instance
 * @type {ioBroker.Adapter}
 */
let adapter;

function getPermutations(list, maxLen) {
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

function getBinary(arr) {
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
// eslint-disable-next-line no-unused-vars
function createRPWStates() {
	const ret = {};
	const res = getPermutations([0, 1], 7);
	for (let i = 0; i < res.length; i++) {
		const bin = getBinary(res[i]);
		//Unbekannte States hinzugügen
		// eslint-disable-next-line no-prototype-builtins
		if (!rpwFixStates.hasOwnProperty(bin) && (bin.match(/1/g) || []).length > 1) {
			const tmpArr = [];
			const tmp = new Array(res[i].length).fill(0);
			//Ermittelt die Position der Einsen, um damit die fixen Tage zu ermitteln
			for (let l = 0; l < res[i].length; l++) {
				if (res[i][l] == 1) {
					tmp[l] = 1;
					tmpArr.unshift(rpwFixStates[getBinary(tmp)]);
					tmp.fill(0);
				}
			}

			rpwFixStates[bin] = tmpArr.join(";");
		}
		//Dezimalzahlen sind die neuen Keys
		ret[parseInt(bin, 2)] = rpwFixStates[bin];
	}

	return ret;
}

/**
 * Starts the adapter instance
 * @param {Partial<utils.AdapterOptions>} [options]
 */
function startAdapter(options) {
	options = options || {};
	// Create the adapter and define its methods
	return (adapter = utils.adapter(
		Object.assign({}, options, {
			name: adapterName,

			// The ready callback is called when databases are connected and adapter received configuration.
			// start here!
			ready: main, // Main method defined below for readability

			// is called when adapter shuts down - callback has to be called under any circumstances!
			unload: (callback) => {
				try {
					// Here you must clear all timeouts or intervals that may still be active
					server.close();

					callback();
				} catch (e) {
					this.log.debug("Error while unload: " + e);
					callback();
				}
			},

			// If you need to react to object changes, uncomment the following method.
			// You also need to subscribe to the objects with `adapter.subscribeObjects`, similar to `adapter.subscribeStates`.
			// objectChange: (id, obj) => {
			// 	if (obj) {
			// 		// The object was changed
			// 		adapter.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
			// 	} else {
			// 		// The object was deleted
			// 		adapter.log.info(`object ${id} deleted`);
			// 	}
			// },

			// is called if a subscribed state changes
			stateChange: (id, state) => {
				// The state was changed by GUI
				if (state && !state.ack) {
					let val = state.val;
					adapter.log.debug(
						"state " + id + " changed: " + val + " (ack = " + state.ack + ")",
					);

					//Änderungen für Response merken
					const arr = id.split(".");
					id = arr[arr.length - 1];

					const device = devicesMap.get(arr[arr.length - 2]);
					val = device.convertFromGUI(id, val);
					device.changed.set(id, val);
				}
			},

			// If you need to accept messages in your adapter, uncomment the following block.
			// /**
			//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
			//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
			//  */
			// message: (obj) => {
			// 	if (typeof obj === "object" && obj.message) {
			// 		if (obj.command === "send") {
			// 			// e.g. send email or pushover or whatever
			// 			adapter.log.info("send command");

			// 			// Send response in callback if required
			// 			if (obj.callback) adapter.sendTo(obj.from, obj.command, "Message received", obj.callback);
			// 		}
			// 	}
			// },
		}),
	));
}

async function createObjectWithState(dev, name, value) {
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
				obj.common.states = eval(dp.states);
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
		await adapter.setObjectNotExistsAsync(obj._id, obj);

		//Value setzen
		adapter.setState(obj._id, value, true);

		adapter.log.debug("Object created: " + adapter.namespace + "." + obj._id);
	} catch (e) {
		adapter.log.error("Object " + obj._id + " error on creation: " + e.message);
	}
}

function getXmlBasicC() {
	let ret = "";
	basicC.forEach((c) => (ret += '<c n="' + c + '" v=""/>'));
	return ret;
}

function getXmlAllC(device) {
	let ret = "";

	if (device) {
		for (const key in device) {
			if (key.startsWith("get")) {
				//Wenn der Datenpunkt geändert wurde, muss im Response-XML eine Zeile mit dem set statt get und dem
				//neuen Value hinzugefügt werden.
				if (device.changed.has(key)) {
					ret +=
            '<c n="' +
            key.replace(/get/g, "set") +
            '" v="' +
            device.changed.get(key) +
            '"/>';
					device.changed.delete(key);
				}

				ret += '<c n="' + key + '" v=""/>';
			}
		}
	}

	return ret;
}

async function initWebServer(settings) {
	const app = express();

	server = app.listen(parseInt(settings.webport, 10) || 8090, settings.host);

	// for parsing application/x-www-form-urlencoded
	app.use(express.urlencoded({ extended: true }));

	app.post(
		"/WebServices/SyrConnectLimexWebService.asmx/GetBasicCommands",
		(req, res) => {
			basicCommands(req, res);
		},
	);
	app.post("/GetBasicCommands", (req, res) => {
		basicCommands(req, res);
	});

	app.post(
		"/WebServices/SyrConnectLimexWebService.asmx/GetAllCommands",
		(req, res) => {
			allCommands(req, res);
		},
	);
	app.post("/GetAllCommands", (req, res) => {
		allCommands(req, res);
	});

	return app;
}

function basicCommands(req, res) {
	adapter.log.debug(req.path);

	res.set("Content-Type", "text/xml");
	res.send(xmlStart + getXmlBasicC() + xmlEnd);
}

function allCommands(req, res) {
	adapter.log.debug(req.path + ": " + req.body.xml);

	xml
		.parseStringPromise(req.body.xml)
		.then(async function (result) {
			const json = result.sc.d[0].c;

			const device = await getDevice(json);
			if (device) {
				for (let i = 0; i < json.length; i++) {
					const id = json[i].$.n;

					const newVal = device.convertToGUI(id, json[i].$.v);

					//Objekte erzeugen und Values setzen, wenn es sich um neue Daten handelt
					const knownObj = await adapter.getObjectAsync(
						device.name + "." + device.id + "." + id,
					);
					if (!knownObj) {
						await createObjectWithState(device, id, newVal);
					} else {
						//Bei bekannten Objekten, den Status bei Bedarf aktualisieren
						const state = await adapter.getStateAsync(
							device.name + "." + device.id + "." + id,
						);
						if (state) {
							const oldVal = state.val;
							if (
								(state.ack && oldVal != newVal) ||
                (!state.ack && oldVal == newVal)
							) {
								adapter.setStateAsync(
									device.name + "." + device.id + "." + id,
									newVal,
									true,
								);
							}
						}
					}
				}

				//Event für Statusänderungen für alle Objekte des Adapters registrieren
				adapter.subscribeStates("*");
			}

			//Response senden
			res.set("Content-Type", "text/xml");
			const responseXml = xmlStart + getXmlAllC(device) + xmlEnd;
			res.send(responseXml);

			adapter.log.debug("Response: " + responseXml);
		})
		.catch(function (err) {
			adapter.log.error(err);
		});
}

async function getDevice(json) {
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
			if (!devicesMap.has(ser)) {
				if (name.toLowerCase() == "lex10") {
					devicesMap.set(ser, new Lex10(ser, name));
				}
			}
			break;
		}
	}

	return devicesMap.get(ser);
}

async function main() {
	initWebServer(adapter.config)
		.then(() => {
			adapter.log.info(
				"Webserver started listening on " +
          adapter.config.host +
          ":" +
          adapter.config.webport,
			);
		})
		.catch((err) => {
			adapter.log.error("Failed to initWebServer: " + err);
			adapter.terminate
				? adapter.terminate(utils.EXIT_CODES.ADAPTER_REQUESTED_TERMINATION)
				: process.exit(utils.EXIT_CODES.ADAPTER_REQUESTED_TERMINATION);
		});

	// The adapters config (in the instance object everything under the attribute "native") is accessible via
	// adapter.config:
	//	adapter.log.info("config option1: " + adapter.config.option1);
	//	adapter.log.info("config option2: " + adapter.config.option2);

	/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
	*/
	//	await adapter.setObjectNotExistsAsync("testVariable", {
	//		type: "state",
	//		common: {
	//			name: "testVariable",
	//			type: "boolean",
	//			role: "indicator",
	//			read: true,
	//			write: true,
	//		},
	//		native: {},
	//	});

	// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
	//	adapter.subscribeStates("testVariable");
	// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
	// adapter.subscribeStates("lights.*");
	// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
	// adapter.subscribeStates("*");

	/*
		setState examples
		you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
	*/
	// the variable testVariable is set to true as command (ack=false)
	//	await adapter.setStateAsync("testVariable", true);

	// same thing, but the value is flagged "ack"
	// ack should be always set to true if the value is received from or acknowledged from the target system
	//	await adapter.setStateAsync("testVariable", { val: true, ack: true });

	// same thing, but the state is deleted after 30s (getState will return null afterwards)
	//	await adapter.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

	// examples for the checkPassword/checkGroup functions
	//	adapter.checkPassword("admin", "iobroker", (res) => {
	//		adapter.log.info("check user admin pw iobroker: " + res);
	//	});
	//
	//	adapter.checkGroup("admin", "admin", (res) => {
	//		adapter.log.info("check group user admin group admin: " + res);
	//	});
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
	// Export startAdapter in compact mode
	module.exports = startAdapter;
} else {
	// otherwise start the instance directly
	startAdapter();
}
