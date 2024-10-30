"use strict";

const Datapoint = require("./Datapoint.js");

const str = "string";
const nbr = "number";
const bool = "boolean";

const LexPlus10SL = function (id, name) {
	this.id = id;
	this.name = name;
	this.getSRN = new Datapoint("Seriennummer", str, "", null, null, null, false, null);
	this.getVER = new Datapoint("Firmware Version", str, "", null, null, null, false, null);
	this.getTYP = new Datapoint("Gerätetyp", nbr, "", null, null, null, false, null);
	this.getCNA = new Datapoint("Gerätename", str, "", null, null, null, false, null);
	this.getALM = new Datapoint("Alarm", str, "", null, null, null, false, null);
	this.getAB = new Datapoint("Ventil", nbr, "", 1, 2, 1, true, { 1: "open", 2: "close" });
	this.getCS1 = new Datapoint("Kapazität Austauscherharz 1", nbr, "%", 0, 110, 0, false, null);
	this.getIPA = new Datapoint("IP-Adresse", str, "", null, null, null, false, null);
	this.getLAR = new Datapoint("Letzte Regeneration", nbr, "", 0, null, null, false, null);
	this.getCOF = new Datapoint("Vergangener kumulierter Wasserverbrauch", nbr, "l", 0, null, null, false, null);
	this.getUNI = new Datapoint("", str, "", null, null, null, false, null);
	this.getLNG = new Datapoint("", str, "", null, null, null, false, null);
	this.getBLT = new Datapoint("", str, "", null, null, null, false, null);
	this.getDMA = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getCNO = new Datapoint("", str, "", null, null, null, false, null);
	this.getFIR = new Datapoint("Firmwarename", str, "", null, null, null, false, null);
	this.getFLO = new Datapoint("Aktueller Durchfluss", nbr, "l/min", 0, 110, 0, false, null);
	this.getPRS = new Datapoint("Wasserdruck", nbr, "bar", 0, 10, 0, false, null);
	this.getCEL = new Datapoint("Wassertemperatur", nbr, "°C", 0, 100, 0, false, null);
	this.getBSI = new Datapoint("", str, "", null, null, null, false, null);
	this.getAVO = new Datapoint("", nbr, "ml", 0, null, 0, false, null);
	this.getVOL = new Datapoint("", str, "", null, null, null, false, null);
	this.getBSA = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getFLL = new Datapoint("", str, "", null, null, null, false, null);
	this.getEXI = new Datapoint("", str, "", null, null, null, false, null);
	this.getAWY = new Datapoint("", str, "", null, null, null, false, null);
	this.getSRV = new Datapoint("", str, "", null, null, null, false, null);
	this.getCEO = new Datapoint("", str, "", null, null, null, false, null);
	this.getDBD = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getDBT = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getDST = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getDCM = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getDOM = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getDPL = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getDTC = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getDPH = new Datapoint("", str, "", null, null, null, false, null);
	this.getRES = new Datapoint("Restkapazität", nbr, "l", 0, 10000, 0, false, null);
	this.getRG1 = new Datapoint("Regeneration läuft 1", bool, "", null, null, false, false, null);
	this.getMEX = new Datapoint("", str, "", null, null, null, false, null);
	this.getTPA = new Datapoint("", str, "", null, null, null, false, null);
	this.getRPD = new Datapoint("Regeneration alle x Tage", nbr, "Tage", 0, 365, 0, true, null);
	this.getRPW = new Datapoint("Regeneration jeden xten Tag der Woche", nbr, "", 0, 127, 0, true, "createRPWStates()");
	this.getRTH = new Datapoint("Regenerationsuhrzeit (Stunde)", nbr, "", 0, 23, 2, true, null);
	this.getBOX = new Datapoint("", str, "", null, null, null, false, null);
	this.getRTM = new Datapoint("Regenerationsuhrzeit (Minute)", nbr, "", 0, 59, 0, true, null);
	this.getFLG = new Datapoint("", str, "", null, null, null, false, null);
	this.getINT = new Datapoint("", str, "", null, null, null, false, null);
	this.getSS1 = new Datapoint("Salzvorrat 1", nbr, "Wochen", 0, 52, 0, false, null);
	this.getHUM = new Datapoint("", str, "", null, null, null, false, null);
	this.getBUP = new Datapoint("", str, "", null, null, null, false, null);
	this.getSTA = new Datapoint("Name laufendes Programm", str, "", null, null, null, false, null);
	this.getSV1 = new Datapoint("Salzmenge im Behälter 1", nbr, "kg", 0, 50, 0, true, null);
	this.getGLE = new Datapoint("", str, "", null, null, null, false, null);
	this.getGUL = new Datapoint("", str, "", null, null, null, false, null);
	this.getTOR = new Datapoint("Summe Regenerationsvoränge", nbr, "", 0, 1000000, 0, false, null);
	this.getDSW = new Datapoint("", str, "", null, null, null, false, null);
	this.getDRP = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getAEF = new Datapoint("", str, "", null, null, null, false, null);
	this.getUL = new Datapoint("Leckageschutzmodus", nbr, "", 0, 1, 0, true, { 0: "present", 1: "absent" });
	this.getTC = new Datapoint("", str, "", null, null, null, false, null);
	this.getNPS = new Datapoint("Leckagemenge", nbr, "ml", 0, null, 0, false, null);
	this.getTO = new Datapoint("", str, "", null, null, null, false, null);
	this.getVLV = new Datapoint("Ventilstatus", nbr, "", 10, 21, 20, false, {
		10: "closed",
		11: "closing",
		20: "open",
		21: "opening",
	});
	this.getALA = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getEN = new Datapoint("", str, "", null, null, null, false, null);
	this.getKW = new Datapoint("", str, "", null, null, null, false, null);
	this.getCTR = new Datapoint("", str, "", null, null, null, false, null);
	this.getLE = new Datapoint("Leckagevolumen", nbr, "l", 0, null, 0, false, null);
	this.getREL = new Datapoint("", str, "", null, null, null, false, null);
	this.getT1 = new Datapoint("", str, "", null, null, null, false, null);
	this.getT2 = new Datapoint("Leckagedauer", nbr, "h", 0, null, 0, false, null);
	this.get48 = new Datapoint("", str, "", null, null, null, false, null);
	this.getBAT = new Datapoint("", str, "", null, null, null, false, null);
	this.getTMP = new Datapoint("Unterbrechung Leckageschutz", nbr, "s", 0, null, 0, true, null);
	this.getBRI = new Datapoint("", str, "", null, null, null, false, null);
	this.get71 = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getTN = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getBAR = new Datapoint("", str, "", null, null, null, false, null);
	this.getBUZ = new Datapoint("", str, "", null, null, null, false, null);
	this.getNET = new Datapoint("", str, "", null, null, null, false, null);

	this.convertToGUI = function (id, val) {
		//Umwandlung von String in Number. Bei IDs SRN, VER darf aber keine Umwandlung
		//erfolgen, denn der Typ des DP ist String.
		if (id !== "getSRN" && id !== "getVER" && val !== "" && typeof val !== "boolean") {
			const valTmp = Number(val);
			if (!Number.isNaN(valTmp)) {
				val = valTmp;
			}
		}

		if (id == "getT2") {
			return val * 0.5;
		}
		if (id == "getLE") {
			return val * 50;
		}
		//Werte werden als 10fache Menge übermittelt
		if (id == "getPRS" || id == "getCEL" || id == "getNPS") {
			return val / 10;
		}
		//In boolean konvertieren
		if (id == "getRG1") {
			return val == "1";
		}

		//Name Regenerationsprogramm lesbar machen
		if (id == "getSTA" && typeof val === "string") {
			val = val.replace(/Neubef.{1}llung/g, "Neubefüllung");
			val = val.replace(/R.{1}ck/g, "Rück");
			val = val.replace(/p.{1}l+ung/g, "pülung");
			val = val.replace("langsame", "langsame Spülung");
			return val;
		}

		//Einheit aus AVO entfernen
		if (id == "getAVO" && typeof val === "string") {
			val = Number(val.replace(/\D*/g, ""));
		}

		return val;
	};

	this.convertFromGUI = function (id, val) {
		if (id == "getT2") {
			return val / 0.5;
		}
		if (id == "getLE") {
			return val / 50;
		}
		if (id == "getPRS" || id == "geCEL" || id == "getNPS") {
			return val * 10;
		}
		//DPs vom type boolean
		if (id == "getRG1") {
			return val ? "1" : "0";
		}

		return val;
	};

	this.changed = new Map();
};

module.exports = LexPlus10SL;
