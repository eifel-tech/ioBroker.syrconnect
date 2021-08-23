"use strict";

var Datapoint = require('./Datapoint.js');

const str = "string";
const nbr = "number";
const bool = "boolean";

var Lex10 = function(id, name) {
	this.id = id;
	this.name = name;
	this.getSRN = new Datapoint("Seriennummer", str, "", null, null, null, false, null);
	this.getVER = new Datapoint("Firmware Version", str, "", null, null, null, false, null);
	this.getTYP = new Datapoint("", str, "", null, null, null, false, null);
	this.getCNA = new Datapoint("Gerätename", str, "", null, null, null, false, null);
	this.getALM = new Datapoint("Alarm", str, "", null, null, null, false, null);
	this.getCDE = new Datapoint("", str, "", null, null, null, false, null);
	this.getCS1 = new Datapoint("Kapazität Austauscherharz 1", nbr, "%", 0, 100, 0, false, null);
	this.getCS2 = new Datapoint("Kapazität Austauscherharz 2", nbr, "%", 0, 100, 0, false, null);
	this.getCS3 = new Datapoint("Kapazität Austauscherharz 3", nbr, "%", 0, 100, 0, false, null);
	this.getCYN = new Datapoint("Nummer laufendes Programm", nbr, "", 0, 1000, 0, false, null); 
	this.getCYT = new Datapoint("Dauer laufendes Programm [mm:ss]", str, "", null, null, null, false, null);
	this.getDEN = new Datapoint("", str, "", null, null, null, false, null);
	this.getDGW = new Datapoint("Gateway", str, "", null, null, null, false, null);
	this.getDWF = new Datapoint("Durchschnittlicher Tageswasserverbrauch", nbr, "l", 0, 5000, 200, true, null);
	this.getFCO = new Datapoint("Eisengehalt", nbr, "ppm", 0, 100, 0, true, null);
	this.getFIR = new Datapoint("", str, "", null, null, null, false, null);
	this.getFLO = new Datapoint("Aktueller Durchfluss", nbr, "l/min", 0, 100, 0, false, null);
	this.getHED = new Datapoint("Urlaub Beginn Tag", nbr, "", 1, 31, 1, true, null);
	this.getHEM = new Datapoint("Urlaub Beginn Monat", nbr, "", 1, 12, 1, true, null);
	this.getHEY = new Datapoint("Uralub Beginn Jahr", nbr, "", 0, 99, 0, true, null);
	this.getHSD = new Datapoint("Urlaub Ende Tag", nbr, "", 1, 31, 1, true, null);
	this.getHSM = new Datapoint("Urlaub Ende Monat", nbr, "", 1, 12, 1, true, null);
	this.getHSY = new Datapoint("Urlaub Ende Jahr", nbr, "", 0, 99, 0, true, null);
	this.getIPH = new Datapoint("", str, "", null, null, null, false, null);
	this.getIWH = new Datapoint("Rohwasserhärte", nbr, "°dH", 1, 100, 21, true, null);
	this.getMAC = new Datapoint("Mac-Adresse", str, "", null, null, null, false, null);
	this.getMAN = new Datapoint("Hersteller", str, "", null, null, null, false, null);
	this.getNOT = new Datapoint("", str, "", null, null, null, false, null);
	this.getOWH = new Datapoint("Weichwasserhärte", nbr, "°dH", 0, 100, 2, true, null);
	this.getPA1 = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getPA2 = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getPA3 = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getPRS = new Datapoint("Wasserdruck", nbr, "bar", 0, 10, 0, false, null);
	this.getPST = new Datapoint("", str, "", null, null, null, false, null);
	this.getRDO = new Datapoint("Regenerationsmitteldosierung", nbr, "g/l", 0, 1000, 0, true, null);
	this.getRES = new Datapoint("Restkapazität", nbr, "l", 0, 1000, 0, false, null);
	this.getRG1 = new Datapoint("Regeneration läuft 1", bool, "", null, null, false, false, null);
	this.getRG2 = new Datapoint("Regeneration läuft 2", bool, "", null, null, false, false, null);
	this.getRG3 = new Datapoint("Regeneration läuft 3", bool, "", null, null, false, false, null);
	this.getRPD = new Datapoint("Regeneration alle x Tage", nbr, "Tage", 0, 365, 0, true, null);
	this.getRPW = new Datapoint("Regeneration jeden xten Tag der Woche", nbr, "", 0, 127, 0, true, "createRPWStates()");
	this.getRTH = new Datapoint("Regenerationsuhrzeit (Stunde)", nbr, "", 0, 23, 2, true, null);
	this.getRTI = new Datapoint("Gesamte Regenerationsdauer [hh:mm]", str, "", null, null, null, false, null);
	this.getRTM = new Datapoint("Regenerationsuhrzeit (Minute)", nbr, "", 0, 59, 0, true, null);
	this.getSCR = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getSRE = new Datapoint("", str, "", null, null, null, false, null);
	this.getSS1 = new Datapoint("Salzvorrat 1", nbr, "Wochen", 0, 52, 0, false, null);
	this.getSS2 = new Datapoint("Salzvorrat 2", nbr, "Wochen", 0, 52, 0, false, null);
	this.getSS3 = new Datapoint("Salzvorrat 3", nbr, "Wochen", 0, 52, 0, false, null);
	this.getSTA = new Datapoint("Name laufendes Programm", str, "", null, null, null, false, null);
	this.getSV1 = new Datapoint("Salzmenge im Behälter 1", nbr, "kg", 0, 50, 0, true, null);
	this.getSV2 = new Datapoint("Salzmenge im Behälter 2", nbr, "kg", 0, 50, 0, true, null);
	this.getSV3 = new Datapoint("Salzmenge im Behälter 3", nbr, "kg", 0, 50, 0, true, null);
	this.getTOR = new Datapoint("Summe Regenerationsvoränge", nbr, "", 0, 1000000, 0, false, null);
	this.getVAC = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getVS1 = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getVS2 = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getVS3 = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getWHU = new Datapoint("", nbr, "", null, null, null, false, null);
	
	this.convertToGUI = function(id, val) {
		//Umwandlung von String in Number. Bei IDs SRN, VER, DEN, PST, SRE darf aber keine Umwandlung
		//erfolgen, denn der Typ des DP ist String.
		if(id !==  "getSRN"
				&& id !== "getVER"
				&& id !== "getDEN"
				&& id !== "getPST"
				&& id !== "getSRE"
				&& val !== '' 
				&& typeof val !== "boolean") {
			let valTmp = Number(val);
			if(!Number.isNaN(valTmp)) {
				val = valTmp;
			}
		} 
	
		//Eisengehalt und Wasserdruck werden als 10fache Menge übermittelt, müssen aber als float gespeichert werden
		if(id == "getPRS"  || id == "getFCO") {
			return val / 10;
		}
		//In boolean konvertieren
		if(id == "getRG1" || id == "getRG2" || id == "getRG3") {
			return val == "1";
		}
		
		//Name Regenerationsprogramm lesbar machen
		if(id == "getSTA") {
			val = val.replace(/Neubef.{1}llung/g, "Neubefüllung");
			val = val.replace(/R.{1}ck/g, "Rück");
			val = val.replace(/p.{1}l+ung/g, "pülung");
			val = val.replace("langsame", "langsame Spülung");
			return val;
		}
		
		return val;
	};
	
	this.convertFromGUI = function(id, val) {
		if(id == "getPRS" || id == "getFCO") {
			return val * 10;
		}
		//DPs vom type boolean
		if(id == "getRG1" || id == "getRG2" || id == "getRG3") {
			return val ? "1" : "0";
		}
		
		return val;
	};
	
	this.changed = new Map();
}

module.exports = Lex10;