'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var angularUtils = require('./utils.js');
var chalk = require('chalk');
var _ = require('lodash');
_.str = require('underscore.string');

var Generator = module.exports = function Generator () {
	yeoman.generators.NamedBase.apply(this, arguments);

	var bowerJson = {};

	try {
		bowerJson = require(path.join(process.cwd(), 'bower.json'))
	} catch (e) {}

	if( bowerJson.name ) {
		this.appName = bowerJson.name;
	} else {
		this.appName = path.basename(process.cwd() );
	}

	this.appName = _.str.slugify(_.str.humanize(this.appName));

	this.scriptAppName = bowerJson.moduleName || _.str.camelize(this.appName) + angularUtils.appName(this);

	this.cameledName = _.str.camelize(this.name);
	this.classedName = _.str.classify(this.name);
	this.dashedName = _.str.dasherize(this.name);

	if( typeof this.env.options.appPath === 'undefined' ) {
		this.env.options.appPath = this.options.appPath || bowerJson.appPath || 'app';
		this.options.appPath = this.env.options.appPath;
	}

	var sourceRoot = '/templates';
	this.scriptSuffix = '.js';
	this.htmlSuffix = '.html';
	this.scssSuffix = '.scss';

	this.sourceRoot(path.join(__dirname, sourceRoot) );
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.addScriptToIndex = function (script)
{
	try {
		var appPath = this.env.options.appPath;
		var fullPath = path.join(appPath, 'index.html');
		angularUtils.rewriteFile({
			file : fullPath,
			needle: '<!-- endbuild -->',
			splicable: [
				'<script src="'+ script.toLowerCase().replace(/\\/g, '/') +'.js"></script>'
			]
		});
	} catch (e) {
		this.log.error(chalk.yellow(
			'\nUnable to find ' + fullPath + '. Reference to ' + script + '.js ' + 'not added.\n'
		));
	}
}

Generator.prototype.addScssToSass = function (script)
{
	try {
		var appPath = this.env.options.appPath;
		var fullPath = path.join(appPath, 'styles','sass','main.scss');
		angularUtils.rewriteFile({
			file : fullPath,
			needle: '// endcomponents',
			splicable: [
				"@import './app/"+ script.toLowerCase().replace(/\\/g, '/') +"';"
			]
		});
	} catch (e) {
		this.log.error(chalk.yellow(
			'\nUnable to find '+ fullPath +'. Reference to '+ script +' not added.\n'
		));
	}
}

Generator.prototype.appTemplate = function (src, dest)
{
	yeoman.generators.Base.prototype.template.apply(this, [
		src + this.scriptSuffix,
		path.join( this.env.options.appPath, dest.toLowerCase()) + this.scriptSuffix
	]);
}

Generator.prototype.htmlTemplate = function (src, dest)
{
	yeoman.generators.Base.prototype.template.apply(this, [
		src + this.htmlSuffix,
		path.join( this.env.options.appPath, dest.toLowerCase()) + this.htmlSuffix
	]);	
}

Generator.prototype.scssTemplate = function (src, dest)
{
	yeoman.generators.Base.prototype.template.apply(this, [
		src + this.scssSuffix,
		path.join( this.env.options.appPath, dest.toLowerCase()) + this.scssSuffix
	]);
}

Generator.prototype.generateSource = function (appTemplate, targetDirectory, skipAdd)
{
	this.appTemplate(appTemplate, path.join(targetDirectory, this.name, this.name) );
	this.htmlTemplate(appTemplate, path.join(targetDirectory, this.name, this.name) );
	this.scssTemplate('_'+ appTemplate, path.join(targetDirectory, this.name, '_'+ this.name) );
	this.addScriptToIndex( path.join(targetDirectory, this.name, this.name) );
	this.addScssToSass( path.join(targetDirectory, this.name, this.name) );
}