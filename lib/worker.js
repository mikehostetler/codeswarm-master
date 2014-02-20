var inherits = require('util').inherits;
var os       = require('os');
var path     = require('path');
var EE2      = require('eventemitter2').EventEmitter2;
var mkdirp   = require('mkdirp');
var extend   = require('util')._extend;
var Command  = require('./command');

module.exports = Worker;

function Worker(build) {
  if (! this instanceof Worker) return new Worker();
  EE2.call(this);
  this.build = build;
  this.reset();
}

inherits(Worker, EE2);

var W = Worker.prototype;

W.init = function init(image, cb) {
  // nothing to see here, move on...
  process.nextTick(cb);
};

W.command = function command(command, args, options) {
  var self = this;

  self._pendingCommands ++;

  options = extend({}, options);
  options.cwd =
    this._fullPath((typeof options.cwd == 'undefined') ?
      this.build.dir :
      options.cwd);

  self.emit('command', command, args, options);
  var child = new Command(command, args, options);
  child.stdout.on('data', onChildStdoutData);
  child.stderr.on('data', onChildStderrData);
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
      self.emit('end');
    }
  }

};

W._fullPath = function fullPath(dir) {
  return path.normalize(path.join(os.tmpdir(), dir));
};

W.reset = function reset() {
  this._pendingCommands = 0;
  this._endAfterCommandsEnd = false;
};

W.end = function end() {
  if (!this._pendingCommands) {
    console.log('[worker] end() - no more pending commands, ending'.yellow);
    this.emit('end');
  } else {
    console.log('[worker] end() - still pending commands, not ending yet...'.yellow);
    this._endAfterCommandsEnd = true;
  }
};

W.dispose = function dispose() {
  console.log('[worker] DISPOSING. Does nothing in local mode');
}