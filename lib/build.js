var domain   = require('domain');
var async    = require('async');
var queue    = require('./queue');
var Plugins  = require('./plugins');
var commands = require('./commands');
var hub      = require('./hub');
var stage_function = require('./stage_function');

// MBH - 2014-02-11 - Look for both environment variables until we can be sure that the transition is complete
if(process.env.VOUCH_REMOTE === 'true' || process.env.CODESWARM_REMOTE === 'true') {
  var Worker   = require('./remoteWorker');
} else {
  var Worker   = require('./worker');
}


var stages = [
  commands.mkdirp,
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
  var worker, plugins;
  var ended = false;

  var d = domain.create();
  d.on('error', onDomainError);
  d.run(run);

  function run() {
    worker = new Worker(build);
    plugins = Plugins.forBuild(build);
    var workerImages = Plugins.workerImages(plugins, build);
    if (workerImages.length < 1)
      throw new Error('could not calculate worker image');
    else if (workerImages.length > 1)
      throw new Error('discordant worker images:' + JSON.stringify(workerImages));

    var workerImage = workerImages[0];

    worker.init(workerImage, workerInitialized);
  }

  function workerInitialized(err) {
    if (err) callback(err);
    hub.addWorker(build, worker);
    worker.emit('build.begin');
    async.eachSeries(stages, runStage, done);
  }


  function onDomainError(err) {
    err.message = 'Domain Error while building ' +
      build.project + ': ' + err.message;

    console.error(err.stack || err);
    callback(err);
  }


  function runStage(stage, cb) {
    var ended = false;

    worker.emit('stage.begin', stage.name || stage);

    if ('function' == typeof stage) {
      stage_function(stage, {}, build, worker, done);
    } else {
      Plugins.each(plugins, stage, build, worker, done);
    }

    function onError(err) {
      console.error(err.stack, err);
      callback(err);
    }

    function onEnd() {
      worker.removeListener('error', onError);
      callback();
    }

    function done(err) {
      if (!ended) {
        ended = true;
        worker.emit('stage.end', stage.name || stage);
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
    worker.emit('build.end');
    worker.dispose();
    cb();
  }
}
