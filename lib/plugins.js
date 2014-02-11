require('colors');

var async        = require('async');
var config       = require('../config/plugins');


/// init

exports.init = init;

var modules;

function init(cb) {
  console.log('[plugins] loading plugins...'.yellow);
  console.log('[plugins] plugin list: %j'.green, config.modules);
  try {
    modules = config.modules.map(loadModule);
  } catch(err) {
    return cb(err);
  }

  async.eachSeries(modules, bootstrap, done);

  function done(err) {
    if (err) cb(err);
    else {
      console.log('[plugins] Loaded modules: %s'.green, modules.map(prop('name')).join(', '));
      cb();
    }
  }
}

function loadModule(moduleName) {
  console.log('[plugins] Loading plugin %s...'.yellow, moduleName);
  var module;
  try {
    module = require(moduleName);
  } catch(err) {
    err.message = 'Error loading plugin ' + moduleName + ': ' + err.message;
    throw err;
  }
  console.log('[plugins] Plugin %s exports %j', moduleName, Object.keys(module));
  module.name = moduleName;
  return module;
}

function bootstrap(module, cb) {
  console.log('[plugins] Bootstrapping plugin %s...'.yellow, module.name);
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

function each(plugins, stage, build, worker) {
  console.log('[plugins] stage %j on project %j'.yellow, stage, build.project);

  var ended = false;
  async.eachSeries(modules, run, done);
  var pluginCount = 0;

  function run(plugin, cb) {

    var fn = plugin[stage];
    if ('function' == typeof fn) {
      worker.reset();
      pluginCount ++;
      console.log('[plugins] running plugin %s on stage'.yellow, plugin.name, stage);
      worker.emit('plugin.start', plugin.name);
      worker.once('end', onEnd);

      fn.call(plugin, build, worker);
    } else cb();

    function onEnd() {
      console.log('plugin %s ENDED'.green, plugin.name);

      if (!ended) {
        ended = true;
        worker.emit('plugin.end', plugin.name);
        cb();
      }
    }
  }

  function done(err) {
    if (err) {
      worker.emit('error', err);
      console.log('[plugin] plugin round ended for stage %s with an error',
        stage, err.stack || err);
    } else {
      console.log('[plugin] plugin round ended for stage %s, ran %d plugins', stage, pluginCount);
    }
    if (! ended) worker.emit('end');
  }
}


/// forBuild

// detect whether a given plugin is suitable for a given build

function forBuildFilter(build) {
  return function(plugin) {
    return true; // TODO: detect plugins??
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