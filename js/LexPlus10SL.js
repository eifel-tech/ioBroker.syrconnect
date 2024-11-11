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
	this.getCDE = new Datapoint("", str, "", null, null, null, false, null);
	this.getCDF = new Datapoint("", str, "", null, null, null, false, null);
	this.getAB = new Datapoint("Ventil", nbr, "", 1, 2, 1, true, { 1: "open", 2: "close" });
	this.getCS1 = new Datapoint("Kapazität Austauscherharz 1", nbr, "%", 0, 110, 0, false, null);
	this.getCYN = new Datapoint("Nummer laufendes Programm", nbr, "", 0, 1000, 0, false, null);
	this.getCYT = new Datapoint("Dauer laufendes Programm [mm:ss]", str, "", null, null, null, false, null);
	this.getDGW = new Datapoint("Gateway", str, "", null, null, null, false, null);
	this.getDWF = new Datapoint("Durchschnittlicher Tageswasserverbrauch", nbr, "l", 0, 5000, 200, true, null);
	this.getFCO = new Datapoint("Eisengehalt", nbr, "ppm", 0, 110, 0, true, null);
	this.getDEN = new Datapoint("", str, "", null, null, null, false, null);
	this.getFSL = new Datapoint("", str, "", null, null, null, false, null);
	this.getIDS = new Datapoint("", str, "", null, null, null, false, null);
	this.getLDF = new Datapoint("", str, "", null, null, null, false, null);
	this.getMTF = new Datapoint("", str, "", null, null, null, false, null);
	this.getOHF = new Datapoint("", str, "", null, null, null, false, null);
	this.getYHF = new Datapoint("", str, "", null, null, null, false, null);
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
	this.getPST = new Datapoint("Drucksensor installiert", nbr, "", 1, 2, 1, false, {
		1: "not available",
		2: "available",
	});
	this.getRDO = new Datapoint("Regenerationsmitteldosierung", nbr, "g/l", 0, 1000, 0, true, null);
	this.getCEL = new Datapoint("Wassertemperatur", nbr, "°C", 0, 100, 0, false, null);
	this.getCES = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getCND = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getCNS = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getDAT = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getINR = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getLAN = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getLWT = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getNOR = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getPRF = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getPRN = new Datapoint("", nbr, "", null, null, null, false, null);
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
	this.getRTI = new Datapoint("Gesamte Regenerationsdauer [hh:mm]", str, "", null, null, null, false, null);
	this.getBOX = new Datapoint("", str, "", null, null, null, false, null);
	this.getRTM = new Datapoint("Regenerationsuhrzeit (Minute)", nbr, "", 0, 59, 0, true, null);
	this.getSCR = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getFLG = new Datapoint("", str, "", null, null, null, false, null);
	this.getINT = new Datapoint("", str, "", null, null, null, false, null);
	this.getIWH = new Datapoint("Rohwasserhärte", nbr, "°dH", 1, 110, 21, true, null);
	this.getMAC = new Datapoint("Mac-Adresse", str, "", null, null, null, false, null);
	this.getMAN = new Datapoint("Hersteller", str, "", null, null, null, false, null);
	this.getNOT = new Datapoint("", str, "", null, null, null, false, null);
	this.getOWH = new Datapoint("Weichwasserhärte", nbr, "°dH", 0, 110, 2, true, null);
	this.getPA1 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPA2 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPA3 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPA4 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPA5 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPA6 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPA7 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPA8 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPB1 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPB2 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPB3 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPB4 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPB5 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPB6 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPB7 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPB8 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPF1 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPF2 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPF3 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPF4 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPF5 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPF6 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPF7 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPF8 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPM1 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPM2 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPM3 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPM4 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPM5 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPM6 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPM7 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPM8 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPN1 = new Datapoint("", str, "", null, null, null, false, null);
	this.getPN2 = new Datapoint("", str, "", null, null, null, false, null);
	this.getPN3 = new Datapoint("", str, "", null, null, null, false, null);
	this.getPN4 = new Datapoint("", str, "", null, null, null, false, null);
	this.getPN5 = new Datapoint("", str, "", null, null, null, false, null);
	this.getPN6 = new Datapoint("", str, "", null, null, null, false, null);
	this.getPN7 = new Datapoint("", str, "", null, null, null, false, null);
	this.getPN8 = new Datapoint("", str, "", null, null, null, false, null);
	this.getPR1 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPR2 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPR3 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPR4 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPR5 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPR6 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPR7 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPR8 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPT1 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPT2 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPT3 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPT4 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPT5 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPT6 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPT7 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPT8 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPV1 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPV2 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPV3 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPV4 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPV5 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPV6 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPV7 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPV8 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPW1 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPW2 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPW3 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPW4 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPW5 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPW6 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPW7 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getPW8 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getSIR = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getSLE = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getSLF = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getSLO = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getSLP = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getSLT = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getSLV = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getSRE = new Datapoint("", nbr, "", null, null, null, false, null);
	this.getSS1 = new Datapoint("Salzvorrat 1", nbr, "Wochen", 0, 52, 0, false, null);
	this.getHUM = new Datapoint("", str, "", null, null, null, false, null);
	this.getBUP = new Datapoint("", str, "", null, null, null, false, null);
	this.getSTA = new Datapoint("Name laufendes Programm", str, "", null, null, null, false, null);
	this.getSV1 = new Datapoint("Salzmenge im Behälter 1", nbr, "kg", 0, 50, 0, true, null);
	this.getGLE = new Datapoint("", str, "", null, null, null, false, null);
	this.getGUL = new Datapoint("", str, "", null, null, null, false, null);
	this.getTOR = new Datapoint("Summe Regenerationsvoränge", nbr, "", 0, 1000000, 0, false, null);
	this.getVS1 = new Datapoint("", nbr, "", 0, null, 0, false, null);
	this.getWHU = new Datapoint("Einheit Wasserhärte", nbr, "", 0, 1, 0, true, { 0: "°dH", 1: "°fH" });
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
	this.getTMZ = new Datapoint("", str, "", null, null, null, false, null);
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
