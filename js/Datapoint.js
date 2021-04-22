"use strict";

var Datapoint = function(label, type, unit, min, max, def, writable, states) {
	this.label = label;
	this.type = type;
	this.unit = unit;
	this.min = min;
	this.max = max;
	this.def = def;
	this.writable = writable;
	this.states = states;
};

module.exports = Datapoint;