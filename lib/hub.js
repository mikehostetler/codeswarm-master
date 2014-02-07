var EE2      = require('eventemitter2').EventEmitter2;
var builds   = require('../api/db/builds');
var projects = require('../api/db/projects');

var hub = exports = module.exports = new EE2();

var PUSH_INTERVAL_MS = 2000;

/// addWorker

hub.addWorker = addWorker;

function addWorker(build, worker) {

  build.started_at = Date.now();
  build.ended = false;
  build.success = true;

  worker.on('stage.begin', onStageBegin);
  worker.on('stage.end', onStageEnd);
  worker.on('command', onWorkerCommand);
  worker.on('stdout', onWorkerStdout);
  worker.on('stderr', onWorkerStderr);
  worker.on('close', onWorkerClose);
  worker.on('build.end', onBuildEnd);

  pushBuild();
  var interval = setInterval(pushBuild, PUSH_INTERVAL_MS);

  projects.update(build.project, {
    state: 'running',
    started_at: Date.now(),
    ended_at: '',
    last_build: build._id
  }, updatedProject);

  function onStageBegin(stage) {
    build.stage = stage;
    if (! build.stages) build.stages = {};
    if (! build.stages[stage]) build.stages[stage] = {
      ended: false,
      ended_at: undefined,
      commands: []
    };
  }

  function updatedProject(err) {
    if (err) throw err;
  }

  function onStageEnd(stage) {
    build.stages[stage].ended = true;
    build.stages[stage].ended_at = Date.now();
  }

  function onWorkerCommand(cmd, args, options) {
    var command = {
      command: cmd,
      args: args,
      options: options,
      out: '',
      stdout: '',
      stderr: '',
      exitCode: undefined
    };
    build.lastCommand = command;
    build.stages[build.stage].commands.push(command);
  }

  function onWorkerStdout(buf) {
    build.lastCommand.out += buf;
    build.lastCommand.stdout += buf;
  }

  function onWorkerStderr(buf) {
    build.lastCommand.out += buf;
    build.lastCommand.stderr += buf;
  }

  function onWorkerClose(code) {
    build.lastCommand.exitCode = code;
    if (code != 0) {
      build.success = false;
    }
    build.lastCommand.finished_at = Date.now();
    delete build.lastCommand;
  }

  function onBuildEnd() {
    build.ended = true;

    clearInterval(interval);
    interval = undefined;

    build.ended_at = Date.now();
    build.state = build.success ? 'passed' : 'failed';
    builds.update(build, updatedBuild);

    projects.update(build.project, {
      state: build.success ? 'passed' : 'failed',
      ended_at: Date.now()
    }, updatedProject);
  }

  function updatedBuild(err, _build) {
    if (err) throw err;
    build = _build
    pushBuild();
  }

  function pushBuild() {
    sails.io.sockets.in(build.project + ' builds').emit('build', build);
  }

}