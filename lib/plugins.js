require('colors');

var async        = require('async');
var config       = require('../config/plugins');
var project_types  = require('../config/project_types');
var stageFunction = require('./stage_function');


/// init

exports.init = init;

var modules;

function init(cb) {
	sails.log('--------------------------------------------------------'.grey);
  sails.log('Loading CodeSwarm Plugins: '.yellow);
  try {
    modules = config.modules.map(loadModule);
  } catch(err) {
    return cb(err);
  }

  async.eachSeries(modules, bootstrap, done);
  function done(err) {
    if (err) cb(err);
    else {
      //sails.log('[plugins] Loaded modules: '.green, modules.map(prop('name')).join(', '));
			sails.log('--------------------------------------------------------'.grey);
      cb();
    }
  }
}

function loadModule(moduleName) {
  //sails.log('Loading CodeSwarm Plugin '.yellow + moduleName.yellow + ' ...'.yellow);
  var module;
  try {
    module = require(moduleName);
  } catch(err) {
    err.message = 'Error loading plugin ' + moduleName + ': ' + err.message;
    throw err;
  }
	sails.log(' * Loaded: '.yellow+ moduleName.green);
  //sails.log('[plugins] Plugin %s exports %j', moduleName, Object.keys(module));
  module.name = moduleName;
  return module;
}

function bootstrap(module, cb) {
  //sails.log('[plugins] Bootstrapping plugin %s...'.yellow, module.name);
  if ('function' == typeof module.init) module.init(cb);
  else process.nextTick(cb);
}


/// forBuild

exports.forBuild = function forBuild(build) {
  return modules.filter(forBuildFilter(build));
}


/// workerImage

exports.workerImages = function workerImages(plugins, build) {
  return plugins.map(prop('workerImage')).filter(isDefinedFilter);
}


/// each

exports.each = each;

function each(plugins, stage, build, worker, contexts, previousBuild, cb) {
  sails.log('[plugins] stage %j on project %j'.yellow, stage, build.project);

  async.eachSeries(plugins, run, done);
  var pluginCount = 0;

  function run(plugin, cb) {

    sails.log('plugin %j', plugin.name);

    if (! contexts[plugin.name]) contexts[plugin.name] = {};
    var context = contexts[plugin.name];
    var config = build.plugins && build.plugins[plugin.name] || {};

    var fn = plugin[stage];
    if ('function' == typeof fn) {
      sails.log('[plugins] running plugin %s on stage'.yellow, plugin.name, stage);
      pluginCount ++;
      worker.emit('plugin.start', plugin.name);
      stageFunction(fn.bind(plugin), context, config, build, worker, previousBuild, fnEnded);
    } else cb();

    function fnEnded(err) {
      sails.log('plugin %s ended for stage %s'.green, plugin.name, stage);
      worker.emit('plugin.end', plugin.name);
      cb(err);
    }
  }

  function done(err) {

    if (err) {
      worker.emit('error', err);
      sails.log('[plugin] plugin round ended for stage %s with an error',
        stage, err.stack || err);
    } else {
      sails.log('[plugin] plugin round ended for stage %s, ran %d plugins', stage, pluginCount);
    }
    cb(err);
  }
}


/// forBuild

// detect whether a given plugin is suitable for a given build

function forBuildFilter(build) {
  var type = build.type;
  if (! type) throw new Error('No build type');
  var plugins = project_types[type];

  return function(plugin) {
    if (typeof plugin != 'string') plugin = plugin.name;

    return plugins.indexOf(plugin) >= 0;
  }
}


/// Util

function prop(p) {
  return function(o) {
    return o[p];
  };
}


function isDefinedFilter(o) {
  return o !== undefined;
}
