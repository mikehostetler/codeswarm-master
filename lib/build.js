var domain   = require('domain');
var async    = require('async');
var queue    = require('./queue');
var plugins  = require('./plugins');
var commands = require('./commands');
var Worker   = require('./worker');

var stages = [
  commands.clone,
  'env',
  'prepare',
  'test',
  'analyze',
  'deploy',
  'cleanup',
  commands.purge
];

/// build

exports = module.exports = build;

function build(build, cb) {
  queue.push(build, cb);
}


/// work

exports.work = work;

function work(build, cb) {
  var ended = false;
  var d = domain.create();
  var worker = new Worker(build);

  d.on('error', onDomainError);

  function onDomainError(err) {
    err.message = 'Domain Error while building ' +
      build.project + ': ' + err.message;

    console.error(err.stack || err);
    callback(err);
  }

  d.run(function() {
    async.eachSeries(stages, runStage, done);
  });

  function runStage(stage, cb) {
    var ended = false;

    worker.on('error', onError);
    worker.once('end', onEnd);

    if ('function' == typeof stage) {
      stage(build, worker);
    } else {
      plugins.each(stage, build, worker);
    }

    function onError(err) {
      console.error(err.stack, err);
      callback(err);
    }

    function onEnd() {
      console.log('WORKER ENDED');
      worker.removeListener('error', onError);
      callback();
    }

    function callback(err) {
      if (!ended) {
        ended = true;
        cb(err);
      }
    }
  }

  function callback(err) {
    if (!ended) {
      ended = true;
      done(err);
    }
  }


  function done(err) {
    console.log('[build] build ended. error: %j', err && err.stack || err);
    cb();
  }
}