var EE2 = require('eventemitter2').EventEmitter2;
var builds = require('../api/db/builds');

var hub = exports = module.exports = new EE2();


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

  function onStageBegin(stage) {
    build.stage = stage;
    if (! build.stages) build.stages = {};
    if (! build.stages[stage]) build.stages[stage] = {
      ended: false,
      ended_at: undefined,
      commands: []
    };
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
      stdout: '',
      stderr: '',
      exitCode: undefined
    };
    build.lastCommand = command;
    build.stages[build.stage].commands.push(command);
  }

  function onWorkerStdout(buf) {
    build.lastCommand.stdout += buf;
  }

  function onWorkerStderr(buf) {
    build.lastCommand.stderr += buf;
  }

  function onWorkerClose(code) {
    build.lastCommand.exitCode = code;
    if (code != 0)
      build.success = false;
    build.lastCommand.finished_at = Date.now();
    delete build.lastCommand;
  }

  function onBuildEnd() {
    build.ended = true;
    build.ended_at = Date.now();
    build.state = build.success ? 'ended' : 'error';
    builds.update(build, updatedBuild);
  }

  function updatedBuild(err) {
    if (err) throw err;
  }


}