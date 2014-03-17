var inherits = require('util').inherits;
var Test     = require('remote-test');
var Worker   = require('./worker');
var extend   = require('util')._extend;

module.exports = RemoteWorker;

function RemoteWorker(build) {
  if (! this instanceof RemoteWorker) return new RemoteWorker(build);
  Worker.call(this, build);
}

inherits(RemoteWorker, Worker);

var RW = RemoteWorker.prototype;

RW.init = function init(image, cb) {
  var self = this;
  this.remoteTest = new Test(image);
  this.remoteTest.on('ready', function() {
    cb();
  });
};

RW.command = function command(command, args, options) {
  var self = this;

  self._pendingCommands ++;

  options = extend({}, options);
  options.cwd = typeof options.cwd == 'undefined' ? this.build.dir : options.cwd;

  self.emit('command', command, args, options);
  var child = this.remoteTest.spawn(command, args, options);
  if (!options.silent) {
    child.stdout.on('data', onChildStdoutData);
    child.stderr.on('data', onChildStderrData);
  }
  child.once('close', onChildClose);

  return child;

  function onChildStdoutData(d) {
    process.stdout.write('[worker] stdout: ' + d);
    self.emit('stdout', d);
  }

  function onChildStderrData(d) {
    process.stdout.write('[worker] stderr: ' + d);
    self.emit('stderr', d);
  }

  function onChildClose(code) {
    self.emit('close', code);
    if (code != 0) self.emit('error', new Error('Command exited with error code ' + code));

    self._pendingCommands --;

    if (! self._pendingCommands && self._endAfterCommandsEnd) {
      self._terminate();
    }
  }

};

RW.dispose = function dispose() {
  this.remoteTest.finish();
};