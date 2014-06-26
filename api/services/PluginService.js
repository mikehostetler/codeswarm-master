require('colors');

var async        = require('async');
var _						 = require('lodash');
var stageFunction = require('../../lib/stage_function');

/**
 * Plugin Service
 *
 * Central service to manage all plugins and their related functionality
 */

/**
 * PluginService Init
 *  - Loads and registers all available plugins.
 */
exports.init = function init(cb) {
	sails.log('--------------------------------------------------------'.grey);
  sails.log('Loading CodeSwarm Plugins: '.yellow);
  try {
		sails.config.codeswarm.modules = _.map(sails.config.codeswarm.plugins,function (plugin, moduleName, cb) {
				var module;
				try {
					module = plugin;
				} catch(err) {
					err.message = 'Error loading plugin ' + moduleName + ': ' + err.message;
					throw err;
				}
				sails.log(' * Loaded: '.yellow + moduleName.green);
				module.name = moduleName;
				return module;
			});
  } catch(err) {
    return cb(err);
  }

	sails.log('--------------------------------------------------------'.grey);
  sails.log('BootStrapping CodeSwarm Plugins: '.yellow);

	PluginService.runPluginMethod(sails.config.codeswarm.modules, 'init', [], 
			function (err) {
				if (err) { 
					sails.log(' * Unable to initialize CodeSwarm Plugins! '.red);
					sails.log('--------------------------------------------------------'.grey);
					cb(err);
				}
				else {
					sails.log(' * Successfully Loaded all CodeSwarm Plugins! '.yellow);
					sails.log('--------------------------------------------------------'.grey);
					cb();
				}
			});

}

/**
 * Calls an avialable method on all loaded plugins
 */
exports.runPluginMethod = function runPluginMethod(plugins, method, args, cb) {
	// Trigger a single method on all of our plugins
  async.eachSeries(plugins,
			function (plugin, done) {
				PluginService.runSinglePluginMethod(plugin, method, args, done);
			},cb);
}

/**
 * Call a single plugin method on the passed in plugin
 */
exports.runSinglePluginMethod = function runSinglePluginMethod(plugin,method,args,cb) {
	try {
		if ('function' == typeof plugin[method]) {
			sails.log.silly("Running method "+method+" on Plugin "+plugin.name);
			var ourFunction = plugin[method];
			args.push(cb); // Add our callback
			ourFunction.apply(null,args)
		}
		else {
			sails.log.silly("Method "+method+" does not exist on Plugin "+plugin.name);
			cb(null);
		}
  } catch(err) {
    return cb(err);
  }
}

/**
 * PluginService forBuild 
 *  - Detect whether a plugin should be included in a project type
 */
exports.forBuild = function forBuild(build) {
  return sails.config.codeswarm.modules.filter(forBuildFilter(build));

	function forBuildFilter(build) {
		var type = build.type;

		if (! type) throw new Error('No build type');

		var plugins = sails.config.codeswarm.project_types[type];
		return function(plugin) {
			if (typeof plugin != 'string') 
				plugin = plugin.name;

			return plugins.indexOf(plugin) >= 0;
		}
	}
}

/**
 * PluginService workerImages
 * - Determines the worker image for the plugins
 */
exports.workerImages = function workerImages(plugins, build) {
  return plugins.map(_prop('workerImage')).filter(_isDefinedFilter);

	function _prop(p) {
		return function(o) {
			return o[p];
		};
	}

	function _isDefinedFilter(o) {
		return o !== undefined;
	}
}
