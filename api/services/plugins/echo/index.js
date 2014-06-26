
/**
 * CodeSwarm Echo Plugin
 *
 * This plugin was created to facilitate testing more easily and to serve as an example plugin
 */
exports.workerImage = 'node';
exports.env = {};

/// init
exports.init = function init(cb) {
	//console.log("CodeSwarm :: Echo :: init callback");

  /// We could initialize here if we wanted to
  process.nextTick(cb);
}

/// prepare
exports.prepare = function prepare(build, stage) {
	console.log("CodeSwarm :: Echo :: prepare callback");
  stage.command('npm', ['install']);
  stage.end();
}

/// test
exports.test = function test(build, stage) {
	console.log("CodeSwarm :: Echo :: test callback");
  stage.command('npm', ['test']);
  stage.end();
}

// exports.analyze = ...
exports.analyze = function analyze(cb) {
	console.log("CodeSwarm :: Echo :: analyze callback");
  /// We could analyze here if we wanted to
  process.nextTick(cb);
}

// exports.deploy = ...
exports.deploy = function deploy(cb) {
	console.log("CodeSwarm :: Echo :: deploy callback");
  /// We could deploy here if we wanted to
  process.nextTick(cb);
}

// exports.cleanup = ...
exports.cleanup = function cleanup(cb) {
	console.log("CodeSwarm :: Echo :: cleanup callback");
  /// We could cleanup here if we wanted to
  process.nextTick(cb);
}
