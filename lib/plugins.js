require('colors');

var EventEmitter = require('events').EventEmitter;
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
  module.name = moduleName;
  return module;
}

function bootstrap(module, cb) {
  console.log('[plugins] Bootstrapping plugin %s...'.yellow, module.name);
  if ('function' == typeof module.init) module.init(cb);
  else process.nextTick(cb);
}


/// each

exports.each = each;

function each(stage, build, hub) {
  console.log('[plugins] stage %s on build %j'.yellow, stage, build);

  var ended = false;
  async.eachSeries(modules, run, done);

  function run(plugin, cb) {

    var fn = plugin[stage];
    if ('function' == typeof fn) {
      console.log('[plugins] running plugin %s on stage'.yellow, plugin.name, stage);
      var emitter = new EventEmitter();
      hub.emit('plugin.start', plugin.name);

      emitter.on('command', function(cmd) {
        hub.emit('command', cmd);
      });

      emitter.on('stdout', function(d) {
        hub.emit('stdout', d);
      });

      emitter.on('stderr', function(d) {
        hub.emit('stdout', d);
      });

      emitter.on('close', function(code) {
        hub.emit('close', code);
      });

      emitter.once('end', onEnd);

      fn.call(plugin, build, emitter);
    } else cb();

    function onEnd() {
      console.log('plugin %s ENDED'.green, plugin.name);

      if (ended)
        throw new Error('[plugins] Double end detected in stage %s, plugin %s',
          stage, plugin.name);

      ended = true;
      hub.emit('plugin.end', plugin.name);
      cb();
    }
  }

  function done(err) {
    if (err) {
      hub.emit('error', err);
      console.log('[plugin] plugin round ended for stage %s with an error',
        stage, err.stack || err);
    } else {
      console.log('[plugin] plugin round ended for stage %s', stage);
    }
    hub.emit('end');
  }
}


/// Util

function prop(p) {
  return function(o) {
    return o[p];
  };
}