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
meta.set("getCS1", ["", nbr, "", null, null, null, false]);
meta.set("getCS2", ["", nbr, "", null, null, null, false]);
meta.set("getCS3", ["", nbr, "", null, null, null, false]);
meta.set("getCYN", ["", str, "", null, null, null, false]); 
meta.set("getCYT", ["", str, "", null, null, null, false]);
meta.set("getDEN", ["", nbr, "", null, null, null, false]);
meta.set("getDGW", ["Gateway", str, "", null, null, null, false]);
meta.set("getDWF", ["Durchschnittlicher Tageswasserverbrauch", nbr, "l", 0, 5000, 200, true]);
meta.set("getFCO", ["Eisengehalt", nbr, "ppm", 0, 100, 0, true]);
meta.set("getFIR", ["", str, "", null, null, null, false]);
meta.set("getFLO", ["Aktueller Wasserverbrauch", nbr, "l/min", 0, 100, 0, false]);
meta.set("getHED", ["", nbr, "", null, null, null, false]);
meta.set("getHEM", ["", nbr, "", null, null, null, false]);
meta.set("getHEY", ["", nbr, "", null, null, null, false]);
meta.set("getHSD", ["", nbr, "", null, null, null, false]);
meta.set("getHSM", ["", nbr, "", null, null, null, false]);
meta.set("getHSY", ["", nbr, "", null, null, null, false]);
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
meta.set("getRG1", ["", nbr, "", null, null, null, false]);
meta.set("getRG2", ["", nbr, "", null, null, null, false]);
meta.set("getRG3", ["", nbr, "", null, null, null, false]);
meta.set("getRPD", ["Regenerationsintervall", nbr, "Tage", 1, 365, 1, false]);
meta.set("getRPW", ["", nbr, "", null, null, null, false]);
meta.set("getRTH", ["Regenerationsuhrzeit (Stunde)", nbr, "", 0, 23, 2, true]);
meta.set("getRTI", ["", str, "", null, null, null, false]);
meta.set("getRTM", ["Regenerationsuhrzeit (Minute)", nbr, "", 0, 59, 0, true]);
meta.set("getSCR", ["", nbr, "", null, null, null, false]);
meta.set("getSRE", ["", nbr, "", null, null, null, false]);
meta.set("getSS1", ["Salzvorrat", nbr, "Wochen", 0, 52, 0, false]);
meta.set("getSS2", ["", nbr, "", null, null, null, false]);
meta.set("getSS3", ["", nbr, "", null, null, null, false]);
meta.set("getSTA", ["", str, "", null, null, null, false]);
meta.set("getSV1", ["Salzmenge im Behälter", nbr, "kg", 0, 50, 0, true]);
meta.set("getSV2", ["", nbr, "", null, null, null, false]);
meta.set("getSV3", ["", nbr, "", null, null, null, false]);
meta.set("getTOR", ["", nbr, "", null, null, null, false]);
meta.set("getVAC", ["", nbr, "", null, null, null, false]);
meta.set("getVS1", ["", nbr, "", null, null, null, false]);
meta.set("getVS2", ["", nbr, "", null, null, null, false]);
meta.set("getVS3", ["", nbr, "", null, null, null, false]);
meta.set("getWHU", ["", nbr, "", null, null, null, false]);

var changed = new Map();

// Load your modules here, e.g.:
// const fs = require("fs");

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
				// clearTimeout(timeout1);
				// clearTimeout(timeout2);
				// ...
				// clearInterval(interval1);

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
			if(!state.ack) {
				adapter.log.debug("state " + id + " changed: " + state.val + " (ack = " + state.ack + ")");
				
				//Änderungen für Response merken
				id = id.substr(id.lastIndexOf(".") + 1);
				changed.set(id, state.val);
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
	if(meta.get(name)[1] === str) {
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
	} else if(meta.get(name)[1] === nbr) {
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
		ret += '<c n="' + key + '" v="' + (changed.has(key) ? changed.get(key) : "") + '"/>';
	}
	
	return ret;
}

async function initWebServer(settings) {
	const server = express();
	
	server.listen(parseInt(settings.webport, 10) || 8090);
	
	// for parsing application/x-www-form-urlencoded
	server.use(express.urlencoded({extended: true})); 
	
	server.post('/GetBasicCommands', (req, res) => {
		adapter.log.debug(req.path);

		res.set('Content-Type', 'text/xml');
		res.send(xmlStart + getXmlBasicC() + xmlEnd);
	});
	
	server.post('/GetAllCommands', (req, res) => {
		adapter.log.debug(req.path + ": " + req.body.xml);
		
		xml.parseStringPromise(req.body.xml).then(async function(result) {
			let json = result.sc.d[0].c;
			for(let i = 0; i < json.length; i++) {
				let id = json[i].$.n;
				//Der Wasserdruck wird als 10fache Menge übermittelt - muss aber als float interpretiert werden
				let newVal = json[i].$.v;
				if(id === "getPRS"
					|| id === "getFCO") {
					newVal = newVal / 10;
				}

				//TODO Setzen buggy?
				if(id.length > 6) {
					adapter.log.debug(id);
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
						if((state.ack && oldVal !== newVal)
								|| (!state.ack && oldVal === newVal)) {
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
		
		changed.clear();
	});
	
	return server;
}

async function main() {
	initWebServer(adapter.config).then(() => {
        adapter.log.info("Webserver started listening on port " + adapter.config.webport);
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