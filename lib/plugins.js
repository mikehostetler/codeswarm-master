require('colors');

var async  = require('async');
var config = require('../config/plugins');

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
  if ('function' == typeof module.init) module.init(cb)
  else process.nextTick(cb);
}

function prop(p) {
  return function(o) {
    return o[p];
  };
}