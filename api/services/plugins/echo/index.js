
/**
 * CodeSwarm Echo Plugin
 *
 * This plugin was created to facilitate testing more easily and to serve as an example plugin
 */
exports.workerImage = 'node';
exports.env = {};

/// init
exports.init = function init(cb) {
	console.log(" ***** [CodeSwarm ECHO PLUGIN] :: Echo :: init callback");
  process.nextTick(cb);
}

/// prepare
exports.prepare = function prepare(build, stage) {
	console.log(" ***** [CodeSwarm ECHO PLUGIN] :: Echo :: prepare callback");
	stage.end();
}

/// test
exports.test = function test(build, stage) {
	console.log(" ***** [CodeSwarm ECHO PLUGIN] :: Echo :: test callback");
	stage.end();
}

// exports.analyze = ...
exports.analyze = function analyze(build, stage) {
	console.log(" ***** [CodeSwarm ECHO PLUGIN] :: Echo :: analyze callback");
	stage.end();
}

// exports.deploy = ...
exports.deploy = function deploy(build, stage) {
	console.log(" ***** [CodeSwarm ECHO PLUGIN] :: Echo :: deploy callback");
	stage.end();
}

// exports.cleanup = ...
exports.cleanup = function cleanup(build, stage) {
	console.log(" ***** [CodeSwarm ECHO PLUGIN] :: Echo :: cleanup callback");
	stage.end();
}
