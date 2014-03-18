var domain   = require('domain');
var async    = require('async');
var queue    = require('./queue');
var Plugins  = require('./plugins');
var commands = require('./commands');
var hub      = require('./hub');
var stageFunction = require('./stage_function');
var Builds   = require('../api/db/builds');
var Projects = require('../api/db/projects');
var testConfig = require('../config/test');

// MBH - 2014-02-11 - Look for both environment variables until we can be sure that the transition is complete
if(process.env.VOUCH_REMOTE === 'true' || process.env.CODESWARM_REMOTE === 'true') {
  var Worker   = require('./remoteWorker');
} else {
  var Worker   = require('./worker');
}


var stages = [
  commands.wipe,
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
  var worker, plugins, previousBuild;
  var ended = false;
  var ranCleanup = false;
  var contexts = {};

  var d = domain.create();
  d.on('error', onDomainError);
  d.run(run);

  function run() {

    Projects.update(build.project, {
      state: 'running',
      started_at: Date.now()
    }, updatedProject);
  }

  function updatedProject(err) {
    if (err) return cb(err);

    async.parallel({
      current: loadCurrentBuild,
      previous: loadPreviousBuild
    }, loadedBuilds);
  }

  function loadCurrentBuild(cb) {
    Builds.get(build.project, build._id || build.id, cb);
  }

  function loadPreviousBuild(cb) {
    if (build.previous_successful_build)
      Builds.get(build.project, build.previous_successful_build, cb);
    else cb();
  }

  function loadedBuilds(err, builds) {
    if (err) return cb(err);
    build = builds.current;
    previousBuild = builds.previous;
    maybeStartWorker();
  }

  function maybeStartWorker() {
    var start = true;
    if (build.state == 'running' || build.state == 'pending') {
      if (! build.created_at) throw new Error('Need build.created_at value');
      var now = Date.now();

      if (! build.fresh) {
        var timeout = build.created_at + testConfig.timeout_ms;
        start = timeout < now;
        if (start) console.log('build %s for %s timed out, rerunning it', build._id, build.project);
        else console.log('build %s for %s is probably still running, leaving it be', build._id, build.project);
      }
      build.fresh = false;
    }
    if (start) {
      build.created_at = Date.now();
      build.state = 'pending';
      Builds.update(build, updatedBuild);
    }
  }

  function updatedBuild(err) {
    if (err) cb(err);
    else startWorker();
  }

  function startWorker() {
    build.stages = {};

    worker = new Worker(build);
    plugins = Plugins.forBuild(build);
    if (! plugins.length) throw new Error('No plugins detected for build');
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

    if (worker) worker.error(err);

    callback(err);
  }


  function runStage(stage, cb) {
    var ended = false;

    if (stage == 'cleanup') ranCleanup = true;

    worker.emit('stage.begin', stage.name || stage);

    if ('function' == typeof stage) {
      stageFunction(stage, {}, {}, build, worker, previousBuild, done);
    } else {
      Plugins.each(plugins, stage, build, worker, contexts, previousBuild, done);
    }

    function done(err) {
      if (!ended) {
        ended = true;
        console.log('[BUILD] STAGE %s ENDED'.red, stage.name || stage);
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
    if (err && ! ranCleanup)
      async.eachSeries(['cleanup', commands.purge], runStage, done2);
    else done2();

    function done2(err2) {
      if (err2) console.error(err2.stack || err2);

      console.log('[build] build ended. error: %j', err && err.stack || err);
      worker.emit('build.end');
      worker.dispose();
      cb();
    }
  }
}
