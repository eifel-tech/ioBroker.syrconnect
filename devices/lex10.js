var Datapoint = require('./Datapoint');

const str = "string";
const nbr = "number";
const bool = "boolean";

module.exports = {
	getSRN: new Datapoint("Seriennummer", nbr, "", null, null, null, false, null),
	getVER: new Datapoint("Firmware Version", nbr, "", null, null, null, false, null),
	getTYP: new Datapoint("", str, "", null, null, null, false, null),
	getCNA: new Datapoint("Gerätename", str, "", null, null, null, false, null),
	getALM: new Datapoint("", str, "", null, null, null, false, null),
	getCDE: new Datapoint("", str, "", null, null, null, false, null),
	getCS1: new Datapoint("Kapazität Austauscherharz 1", nbr, "%", 0, 100, 0, false, null),
	getCS2: new Datapoint("Kapazität Austauscherharz 2", nbr, "%", 0, 100, 0, false, null),
	getCS3: new Datapoint("Kapazität Austauscherharz 3", nbr, "%", 0, 100, 0, false, null),
	getCYN: new Datapoint("Nummer laufendes Programm", nbr, "", 0, 1000, 0, false, null), 
	getCYT: new Datapoint("Dauer laufendes Programm [mm:ss]", str, "", null, null, null, false, null),
	getDEN: new Datapoint("", nbr, "", null, null, null, false, null),
	getDGW: new Datapoint("Gateway", str, "", null, null, null, false, null),
	getDWF: new Datapoint("Durchschnittlicher Tageswasserverbrauch", nbr, "l", 0, 5000, 200, true, null),
	getFCO: new Datapoint("Eisengehalt", nbr, "ppm", 0, 100, 0, true, null),
	getFIR: new Datapoint("", str, "", null, null, null, false, null),
	getFLO: new Datapoint("Aktueller Wasserverbrauch", nbr, "l/min", 0, 100, 0, false, null),
	getHED: new Datapoint("Urlaub Beginn Tag", nbr, "", 1, 31, 1, true, null),
	getHEM: new Datapoint("Urlaub Beginn Monat", nbr, "", 1, 12, 1, true, null),
	getHEY: new Datapoint("Uralub Beginn Jahr", nbr, "", 0, 99, 0, true, null),
	getHSD: new Datapoint("Urlaub Ende Tag", nbr, "", 1, 31, 1, true, null),
	getHSM: new Datapoint("Urlaub Ende Monat", nbr, "", 1, 12, 1, true, null),
	getHSY: new Datapoint("Urlaub Ende Jahr", nbr, "", 0, 99, 0, true, null),
	getIPH: new Datapoint("", str, "", null, null, null, false, null),
	getIWH: new Datapoint("Rohwasserhärte", nbr, "°dH", 1, 100, 21, true, null),
	getMAC: new Datapoint("Mac-Adresse", str, "", null, null, null, false, null),
	getMAN: new Datapoint("Hersteller", str, "", null, null, null, false, null),
	getNOT: new Datapoint("", str, "", null, null, null, false, null),
	getOWH: new Datapoint("Weichwasserhärte", nbr, "°dH", 0, 100, 2, true, null),
	getPA1: new Datapoint("", nbr, "", null, null, null, false, null),
	getPA2: new Datapoint("", nbr, "", null, null, null, false, null),
	getPA3: new Datapoint("", nbr, "", null, null, null, false, null),
	getPRS: new Datapoint("Wasserdruck", nbr, "bar", 0, 10, 0, false, null),
	getPST: new Datapoint("", nbr, "", null, null, null, false, null),
	getRDO: new Datapoint("Regenerationsmitteldosierung", nbr, "g/l", 0, 1000, 0, true, null),
	getRES: new Datapoint("Restkapazität", nbr, "l", 0, 1000, 0, false, null),
	getRG1: new Datapoint("Regeneration läuft 1", bool, "", null, null, false, false, null),
	getRG2: new Datapoint("Regeneration läuft 2", bool, "", null, null, false, false, null),
	getRG3: new Datapoint("Regeneration läuft 3", bool, "", null, null, false, false, null),
	getRPD: new Datapoint("Regeneration alle x Tage", nbr, "Tage", 0, 365, 0, true, null),
	getRPW: new Datapoint("Regeneration jeden xten Tag der Woche", nbr, "", 0, 127, 0, true, "createRPWStates()"),
	getRTH: new Datapoint("Regenerationsuhrzeit (Stunde)", nbr, "", 0, 23, 2, true, null),
	getRTI: new Datapoint("Gesamte Regenerationsdauer [hh:mm]", str, "", null, null, null, false, null),
	getRTM: new Datapoint("Regenerationsuhrzeit (Minute)", nbr, "", 0, 59, 0, true, null),
	getSCR: new Datapoint("", nbr, "", null, null, null, false, null),
	getSRE: new Datapoint("", nbr, "", null, null, null, false, null),
	getSS1: new Datapoint("Salzvorrat 1", nbr, "Wochen", 0, 52, 0, false, null),
	getSS2: new Datapoint("Salzvorrat 2", nbr, "Wochen", 0, 52, 0, false, null),
	getSS3: new Datapoint("Salzvorrat 3", nbr, "Wochen", 0, 52, 0, false, null),
	getSTA: new Datapoint("Name laufendes Programm", str, "", null, null, null, false, null),
	getSV1: new Datapoint("Salzmenge im Behälter 1", nbr, "kg", 0, 50, 0, true, null),
	getSV2: new Datapoint("Salzmenge im Behälter 2", nbr, "kg", 0, 50, 0, true, null),
	getSV3: new Datapoint("Salzmenge im Behälter 3", nbr, "kg", 0, 50, 0, true, null),
	getTOR: new Datapoint("Summe Regenerationsvoränge", nbr, "", 0, 1000000, 0, false, null),
	getVAC: new Datapoint("", nbr, "", null, null, null, false, null),
	getVS1: new Datapoint("", nbr, "", null, null, null, false, null),
	getVS2: new Datapoint("", nbr, "", null, null, null, false, null),
	getVS3: new Datapoint("", nbr, "", null, null, null, false, null),
	getWHU: new Datapoint("", nbr, "", null, null, null, false, null),
	
	convertToGUI: function(id, val) {
		//Eisengehalt und Wasserdruck werden als 10fache Menge übermittelt, müssen aber als float gespeichert werden
		if(id == "getPRS"  || id == "getFCO") {
			return val / 10;
		}
		//In boolean konvertieren
		if(id == "getRG1") {
			return val == "1";
		}
		
		return val;
	},
	
	convertFromGUI: function(id, val) {
		if(id == "getPRS" || id == "getFCO") {
			return val * 10;
		}
		//DPs vom type boolean
		if(id == "getRG1") {
			return val ? "1" : "0";
		}
		
		return val;
	},
	
	changed : new Map()
}