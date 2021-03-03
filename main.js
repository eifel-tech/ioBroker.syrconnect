"use strict";

/*
 * Created with @iobroker/create-adapter v1.31.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const adapterName = require('./package.json').name.split('.').pop();

const express = require('express');
const xml = require('xml2js');

const str = "string";
const nbr = "number";
const bool = "boolean";
const xmlStart = '<?xml version="1.0" encoding="utf-8"?><sc version="1.0"><d>';
const xmlEnd = '</d></sc>';
const basicC = ["getSRN", "getVER", "getTYP", "getCNA"];
const meta = new Map();
//key, [Beschreibung, type, unit, min, max, def, writable];
meta.set("getSRN", ["Seriennummer", nbr, "", null, null, null, false]);
meta.set("getVER", ["Firmware Version", nbr, "", null, null, null, false]);
meta.set("getTYP", ["", str, "", null, null, null, false]);
meta.set("getCNA", ["Gerätename", str, "", null, null, null, false]);
meta.set("getALM", ["", str, "", null, null, null, false]);
meta.set("getCDE", ["", str, "", null, null, null, false]);
meta.set("getCS1", ["Kapazität Austauscherharz 1", nbr, "%", 0, 100, 0, false]);
meta.set("getCS2", ["Kapazität Austauscherharz 2", nbr, "%", 0, 100, 0, false]);
meta.set("getCS3", ["Kapazität Austauscherharz 3", nbr, "%", 0, 100, 0, false]);
meta.set("getCYN", ["Nummer laufendes Programm", nbr, "", 0, 1000, 0, false]); 
meta.set("getCYT", ["Dauer laufendes Programm [mm:ss]", str, "", null, null, null, false]);
meta.set("getDEN", ["", nbr, "", null, null, null, false]);
meta.set("getDGW", ["Gateway", str, "", null, null, null, false]);
meta.set("getDWF", ["Durchschnittlicher Tageswasserverbrauch", nbr, "l", 0, 5000, 200, true]);
meta.set("getFCO", ["Eisengehalt", nbr, "ppm", 0, 100, 0, true]);
meta.set("getFIR", ["", str, "", null, null, null, false]);
meta.set("getFLO", ["Aktueller Wasserverbrauch", nbr, "l/min", 0, 100, 0, false]);
meta.set("getHED", ["Urlaub Beginn Tag", nbr, "", 1, 31, 1, true]);
meta.set("getHEM", ["Urlaub Beginn Monat", nbr, "", 1, 12, 1, true]);
meta.set("getHEY", ["Uralub Beginn Jahr", nbr, "", 0, 99, 0, true]);
meta.set("getHSD", ["Urlaub Ende Tag", nbr, "", 1, 31, 1, true]);
meta.set("getHSM", ["Urlaub Ende Monat", nbr, "", 1, 12, 1, true]);
meta.set("getHSY", ["Urlaub Ende Jahr", nbr, "", 0, 99, 0, true]);
meta.set("getIPH", ["", str, "", null, null, null, false]);
meta.set("getIWH", ["Rohwasserhärte", nbr, "°dH", 1, 100, 21, true]);
meta.set("getMAC", ["Mac-Adresse", str, "", null, null, null, false]);
meta.set("getMAN", ["Hersteller", str, "", null, null, null, false]);
meta.set("getNOT", ["", str, "", null, null, null, false]);
meta.set("getOWH", ["Weichwasserhärte", nbr, "°dH", 0, 100, 2, true]);
meta.set("getPA1", ["", nbr, "", null, null, null, false]);
meta.set("getPA2", ["", nbr, "", null, null, null, false]);
meta.set("getPA3", ["", nbr, "", null, null, null, false]);
meta.set("getPRS", ["Wasserdruck", nbr, "bar", 0, 10, 0, false]);
meta.set("getPST", ["", nbr, "", null, null, null, false]);
meta.set("getRDO", ["Regenerationsmitteldosierung", nbr, "g/l", 0, 1000, 0, true]);
meta.set("getRES", ["Restkapazität", nbr, "l", 0, 1000, 0, false]);
meta.set("getRG1", ["Regeneration läuft 1", bool, "", null, null, false, false]);
meta.set("getRG2", ["Regeneration läuft 2", bool, "", null, null, false, false]);
meta.set("getRG3", ["Regeneration läuft 3", bool, "", null, null, false, false]);
meta.set("getRPD", ["Regenerationsintervall", nbr, "Tage", 1, 365, 1, false]);
meta.set("getRPW", ["", nbr, "", null, null, null, false]);
meta.set("getRTH", ["Regenerationsuhrzeit (Stunde)", nbr, "", 0, 23, 2, true]);
meta.set("getRTI", ["Gesamte Regenerationsdauer [hh:mm]", str, "", null, null, null, false]);
meta.set("getRTM", ["Regenerationsuhrzeit (Minute)", nbr, "", 0, 59, 0, true]);
meta.set("getSCR", ["", nbr, "", null, null, null, false]);
meta.set("getSRE", ["", nbr, "", null, null, null, false]);
meta.set("getSS1", ["Salzvorrat 1", nbr, "Wochen", 0, 52, 0, false]);
meta.set("getSS2", ["Salzvorrat 2", nbr, "Wochen", 0, 52, 0, false]);
meta.set("getSS3", ["Salzvorrat 3", nbr, "Wochen", 0, 52, 0, false]);
meta.set("getSTA", ["Name laufendes Programm", str, "", null, null, null, false]);
meta.set("getSV1", ["Salzmenge im Behälter 1", nbr, "kg", 0, 50, 0, true]);
meta.set("getSV2", ["Salzmenge im Behälter 2", nbr, "kg", 0, 50, 0, true]);
meta.set("getSV3", ["Salzmenge im Behälter 3", nbr, "kg", 0, 50, 0, true]);
meta.set("getTOR", ["", nbr, "", null, null, null, false]);
meta.set("getVAC", ["", nbr, "", null, null, null, false]);
meta.set("getVS1", ["", nbr, "", null, null, null, false]);
meta.set("getVS2", ["", nbr, "", null, null, null, false]);
meta.set("getVS3", ["", nbr, "", null, null, null, false]);
meta.set("getWHU", ["", nbr, "", null, null, null, false]);

var changed = new Map();
var server;

/**
 * The adapter instance
 * @type {ioBroker.Adapter}
 */
let adapter;

/**
 * Starts the adapter instance
 * @param {Partial<utils.AdapterOptions>} [options]
 */
function startAdapter(options) {
	options = options || {};
	// Create the adapter and define its methods
	return adapter = utils.adapter(Object.assign({}, options, {
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
			if(state && !state.ack) {
				let val = state.val;
				
				adapter.log.debug("state " + id + " changed: " + val + " (ack = " + state.ack + ")");
				
				//Änderungen für Response merken
				id = id.substr(id.lastIndexOf(".") + 1);
				if(id == "getPRS"
					|| id == "getFCO") {
					val = val * 10;
				}
				//DPs vom type boolean
				if(id == "getRG1") {
					val = val ? "1" : "0";
				}
				changed.set(id, val);
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
	}));
}

async function createObjectWithState(name, value) {
	let obj;
	//String
	if(meta.get(name)[1] == str) {
		obj = {
	        _id: name,
	        type: "state",
	        common: {
	            name: meta.get(name)[0],
	            type: meta.get(name)[1],
	            role: "value",
	            read: true,
	            write: meta.get(name)[6]
	        },
	        native: {}
	    };
	//Number
	} else if(meta.get(name)[1] == nbr) {
		obj = {
	        _id: name,
	        type: "state",
	        common: {
	            name: meta.get(name)[0],
	            type: meta.get(name)[1],
	            unit: meta.get(name)[2],
	            min: meta.get(name)[3],
	            max: meta.get(name)[4],
	            def: meta.get(name)[5],
	            role: "value",
	            read: true,
	            write: meta.get(name)[6]
	        },
	        native: {}
	    };
	//Boolean
	} else if(meta.get(name)[1] == bool) {
		obj = {
	        _id: name,
	        type: "state",
	        common: {
	            name: meta.get(name)[0],
	            type: meta.get(name)[1],
	            def: meta.get(name)[5],
	            role: "switch",
	            read: true,
	            write: meta.get(name)[6]
	        },
	        native: {}
	    };
	}
	
	try {
		//Objekt erstellen
        await adapter.setObjectNotExistsAsync(obj._id, obj);
        
        //Value setzen
		await adapter.setStateAsync(obj._id, value, true);
		
		adapter.log.debug("Object created: " + adapter.namespace + "." + obj._id);
    } catch (e) {
        adapter.log.error("Object " + obj._id + " error on creation: " + e.message);
    }
}

function getXmlBasicC() {
	let ret = "";
	basicC.forEach(c => ret += '<c n="' + c + '" v=""/>');
	return ret;
}

function getXmlAllC() {
	let ret = "";
	
	for(let key of meta.keys()) {
		//Wenn der Datenpunkt geändert wurde, muss im Response-XML eine Zeile mit dem set statt get und dem
		//neuen Value hinzugefügt werden.
		if(changed.has(key)) {
			ret += '<c n="' + key.replace(/get/g, "set") + '" v="' + changed.get(key) + '"/>';
			changed.delete(key);
		}
		
		ret += '<c n="' + key + '" v=""/>';
	}
	
	return ret;
}

async function initWebServer(settings) {
	const app = express();
	
	server = app.listen(parseInt(settings.webport, 10) || 8090, settings.host);
	
	// for parsing application/x-www-form-urlencoded
	app.use(express.urlencoded({extended: true})); 
	
	app.post('/GetBasicCommands', (req, res) => {
		adapter.log.debug(req.path);

		res.set('Content-Type', 'text/xml');
		res.send(xmlStart + getXmlBasicC() + xmlEnd);
	});
	
	app.post('/GetAllCommands', (req, res) => {
		adapter.log.debug(req.path + ": " + req.body.xml);
		
		xml.parseStringPromise(req.body.xml).then(async function(result) {
			let json = result.sc.d[0].c;
			for(let i = 0; i < json.length; i++) {
				let id = json[i].$.n;
				//Eisengehalt und Wasserdruck werden als 10fache Menge übermittelt, müssen aber als float gespeichert werden
				let newVal = json[i].$.v;
				if(id == "getPRS"
					|| id == "getFCO") {
					newVal = newVal / 10;
				}
				//In boolean konvertieren
				if(id == "getRG1") {
					newVal = newVal == "1";
				}
				
				//Objekte erzeugen und Values setzen, wenn es sich um neue Daten handelt
				let knownObj = await adapter.getObjectAsync(id);
				if(!knownObj) {
					await createObjectWithState(id, newVal);
				} else {
					//Bei bekannten Objekten, den Status bei Bedarf aktualisieren
					let state = await adapter.getStateAsync(id);
					if(state) {
						let oldVal = state.val;
						if((state.ack && oldVal != newVal)
								|| (!state.ack && oldVal == newVal)) {
							adapter.setStateAsync(id, newVal, true);
						}
					}
				}
			}
			
			//Event für Statusänderungen für alle Objekte des Adapters registrieren
			adapter.subscribeStates('*');
		})
		.catch(function(err) {
			adapter.log.error(err);
		});
		
		res.set('Content-Type', 'text/xml');
		let responseXml = xmlStart + getXmlAllC() + xmlEnd;
		res.send(responseXml);
		
		adapter.log.debug("Response: " +  responseXml);
	});
	
	return app;
}

async function main() {
	initWebServer(adapter.config).then(() => {
        adapter.log.info("Webserver started listening on " + adapter.config.host + ":" + adapter.config.webport);
    }).catch(err => {
        adapter.log.error("Failed to initWebServer: " + err);
        adapter.terminate ? adapter.terminate(utils.EXIT_CODES.ADAPTER_REQUESTED_TERMINATION) : process.exit(utils.EXIT_CODES.ADAPTER_REQUESTED_TERMINATION);
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
