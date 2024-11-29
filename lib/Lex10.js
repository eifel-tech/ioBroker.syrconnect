"use strict";

const Datapoint = require("./Datapoint.js");

const str = "string";
const nbr = "number";
const bool = "boolean";

const Lex10 = function (id, name) {
	this.id = id;
	this.name = name;
	this.getSRN = new Datapoint("Serial number", str, "", null, null, null, false, null);
	this.getVER = new Datapoint("Firmware version", str, "", null, null, null, false, null);
	this.getTYP = new Datapoint("Device type", str, "", null, null, null, false, null);
	this.getCNA = new Datapoint("Device name", str, "", null, null, null, false, null);
	this.getALM = new Datapoint("Alarm", str, "", null, null, null, false, null);
	this.getCDE = new Datapoint("", str, "", null, null, null, false, null);
	this.getCS1 = new Datapoint("Capacity exchanger resin 1", nbr, "%", 0, 110, 0, false, null);
	this.getCS2 = new Datapoint("Capacity exchanger resin 2", nbr, "%", 0, 110, 0, false, null);
	this.getCS3 = new Datapoint("Capacity exchanger resin 3", nbr, "%", 0, 110, 0, false, null);
	this.getCYN = new Datapoint("Current program number", nbr, "", 0, 1000, 0, false, null);
	this.getCYT = new Datapoint("Duration of running program [mm:ss]", str, "", null, null, null, false, null);
	this.getDEN = new Datapoint("", str, "", null, null, null, false, null);
	this.getDGW = new Datapoint("Gateway", str, "", null, null, null, false, null);
	this.getDWF = new Datapoint("Average daily water consumption", nbr, "l", 0, 5000, 200, true, null);
	this.getFCO = new Datapoint("Iron content", nbr, "ppm", 0, 110, 0, true, null);
	this.getFIR = new Datapoint("Firmware name", str, "", null, null, null, false, null);
	this.getFLO = new Datapoint("Current flow", nbr, "l/min", 0, 110, 0, false, null);
	this.getHED = new Datapoint("Holiday start day", nbr, "", 1, 31, 1, true, null);
	this.getHEM = new Datapoint("Holiday start month", nbr, "", 1, 12, 1, true, null);
	this.getHEY = new Datapoint("Holiday start year", nbr, "", 0, 99, 0, true, null);
	this.getHSD = new Datapoint("Holiday end day", nbr, "", 1, 31, 1, true, null);
	this.getHSM = new Datapoint("Holiday end month", nbr, "", 1, 12, 1, true, null);
	this.getHSY = new Datapoint("Holiday end year", nbr, "", 0, 99, 0, true, null);
	this.getIPH = new Datapoint("", str, "", null, null, null, false, null);
	this.getIWH = new Datapoint("Water hardness", nbr, "°dH", 1, 110, 21, true, null);
	this.getMAC = new Datapoint("Mac address", str, "", null, null, null, false, null);
	this.getMAN = new Datapoint("Manufacturer", str, "", null, null, null, false, null);
	this.getNOT = new Datapoint("", str, "", null, null, null, false, null);
	this.getOWH = new Datapoint("Soft water hardness", nbr, "°dH", 0, 110, 2, true, null);
	this.getPA1 = new Datapoint("", nbr, "", 0, 0, 0, false, null);
	this.getPA2 = new Datapoint("", nbr, "", 0, 0, 0, false, null);
	this.getPA3 = new Datapoint("", nbr, "", 0, 0, 0, false, null);
	this.getPRS = new Datapoint("Water pressure", nbr, "bar", 0, 10, 0, false, null);
	this.getPST = new Datapoint("Pressure sensor installed", nbr, "", 1, 2, 1, false, {
		1: "not available",
		2: "available",
	});
	this.getRDO = new Datapoint("Regenerant dosage", nbr, "g/l", 0, 1000, 0, true, null);
	this.getRES = new Datapoint("remaining capacity", nbr, "l", 0, 10000, 0, false, null);
	this.getRG1 = new Datapoint("Regeneration running 1", bool, "", null, null, false, false, null);
	this.getRG2 = new Datapoint("Regeneration running 2", bool, "", null, null, false, false, null);
	this.getRG3 = new Datapoint("Regeneration running 3", bool, "", null, null, false, false, null);
	this.getRPD = new Datapoint("Regeneration every x days", nbr, "d", 0, 365, 0, true, null);
	this.getRPW = new Datapoint("Regeneration every xth day of week", nbr, "", 0, 127, 0, true, "createRPWStates()");
	this.getRTH = new Datapoint("Regeneration time (hour)", nbr, "", 0, 23, 2, true, null);
	this.getRTI = new Datapoint("Total regeneration time [hh:mm]", str, "", null, null, null, false, null);
	this.getRTM = new Datapoint("Regeneration time (minute)", nbr, "", 0, 59, 0, true, null);
	this.getSCR = new Datapoint("", nbr, "", 0, 0, 0, false, null);
	this.getSRE = new Datapoint("", str, "", null, null, null, false, null);
	this.getSS1 = new Datapoint("Salt supply 1", nbr, "weeks", 0, 52, 0, false, null);
	this.getSS2 = new Datapoint("Salt supply 2", nbr, "weeks", 0, 52, 0, false, null);
	this.getSS3 = new Datapoint("Salt supply 3", nbr, "weeks", 0, 52, 0, false, null);
	this.getSTA = new Datapoint("Name of current program", str, "", null, null, null, false, null);
	this.getSV1 = new Datapoint("Amount of salt in the container 1", nbr, "kg", 0, 50, 0, true, null);
	this.getSV2 = new Datapoint("Amount of salt in the container 2", nbr, "kg", 0, 50, 0, true, null);
	this.getSV3 = new Datapoint("Amount of salt in the container 3", nbr, "kg", 0, 50, 0, true, null);
	this.getTOR = new Datapoint("Total regeneration priors", nbr, "", 0, 1000000, 0, false, null);
	this.getVAC = new Datapoint("", nbr, "", 0, 0, 0, false, null);
	this.getVS1 = new Datapoint("", nbr, "", 0, 0, 0, false, null);
	this.getVS2 = new Datapoint("", nbr, "", 0, 0, 0, false, null);
	this.getVS3 = new Datapoint("", nbr, "", 0, 0, 0, false, null);
	this.getWHU = new Datapoint("Unit of water hardness", nbr, "", 0, 1, 0, true, { 0: "°dH", 1: "°fH" });

	this.convertToGUI = function (id, val) {
		//Umwandlung von String in Number. Bei IDs SRN, VER, DEN, PST, SRE darf aber keine Umwandlung
		//erfolgen, denn der Typ des DP ist String.
		if (
			id !== "getSRN" &&
			id !== "getVER" &&
			id !== "getDEN" &&
			id !== "getPST" &&
			id !== "getSRE" &&
			val !== "" &&
			typeof val !== "boolean"
		) {
			const valTmp = Number(val);
			if (!Number.isNaN(valTmp)) {
				val = valTmp;
			}
		}

		//Eisengehalt und Wasserdruck werden als 10fache Menge übermittelt, müssen aber als float gespeichert werden
		if (id == "getPRS" || id == "getFCO") {
			return val / 10;
		}
		//In boolean konvertieren
		if (id == "getRG1" || id == "getRG2" || id == "getRG3") {
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

		return val;
	};

	this.convertFromGUI = function (id, val) {
		if (id == "getPRS" || id == "getFCO") {
			return val * 10;
		}
		//DPs vom type boolean
		if (id == "getRG1" || id == "getRG2" || id == "getRG3") {
			return val ? "1" : "0";
		}

		return val;
	};

	this.changed = new Map();
};

module.exports = Lex10;
