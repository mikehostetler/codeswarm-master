var domain  = require('domain');
var EE2     = require('eventemitter2').EventEmitter2;
var async   = require('async');
var queue   = require('./queue');
var plugins = require('./plugins');


var stages = ['env', 'prepare', 'test', 'deploy', 'cleanup'];

/// build

exports = module.exports = build;

function build(build, cb) {
	queue.push(build, cb);
}


/// work

exports.work = work;

function work(build, cb) {
  var d = domain.create();

  d.run(function() {
    async.eachSeries(stages, runStage, done);
  });

  function runStage(stage, cb) {
    var ended = false;

    var emitter = new EE2();
    emitter.on('error', onError);
    emitter.once('end', onEnd);

    plugins.each(stage, build, emitter);

    function onError(err) {
      console.error(err.stack, err);
      callback(err);
    }

    function onEnd() {
      callback();
    }

    function callback(err) {
      if (!ended) {
        ended = true;
        cb(err);
      }
    }
  }

  function done(err) {
    console.log('[build] build ended with error %j', err && err.stack || err);
    cb(err);
  }
}