'use strict';
var util = require('util');
var base = require('../base.js');

var Generator = module.exports = function Generator () {
	base.apply(this, arguments);
}

util.inherits(Generator, base);

Generator.prototype.createComponentFiles = function createComponentFiles() {
	this.generateSource(
		'fluxComponent',
		'components',
		this.options['skip-add'] || false
	);
}