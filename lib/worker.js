var inherits = require('util').inherits;
var os       = require('os');
var path     = require('path');
var EE2      = require('eventemitter2').EventEmitter2;
var mkdirp   = require('mkdirp');
var extend   = require('util')._extend;
var Command  = require('./command');

module.exports = Worker;

function Worker(build) {
  if (! this instanceof Worker) return new Worker(build);
  EE2.call(this);
  this._backgroundCommands = [];
  this.executing = false;
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

  options = extend({}, options || {});

  if (typeof options.cwd == 'undefined')
    options.cwd = self.build.dir;

  if (options.cwd.charAt(0) != '/')
    options.cwd = self._fullPath(options.cwd);

  console.log('[WORKER] command: %s %s (%j)'.yellow, command, args.join(' '), options);

  if (self.executing && !(options.background || options.silent)) throw new Error('Worker already executing command, parallel commands not allowed. Was trying to execute command ' + command);

  if (! options.background) {
    self.executing = true;
    self._pendingCommands ++;
  }

  self.emit('command', command, args, options);
  var child = new Command(command, args, options);

  if (options.background)
    self._backgroundCommands.push(child);

  if (! options.silent) {
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
    if (!options.background) self.executing = false;

    if (options.background) {
      var idx = self._backgroundCommands.indexOf(child);
      if (idx >= 0) {
        self._backgroundCommands.splice(idx, 1);
      }
    }

    self.emit('close', code);
    if (code != 0) self.emit('error', new Error('Command exited with error code ' + code));

    if (! options.background)
      self._pendingCommands --;

    if (! self._pendingCommands && self._endAfterCommandsEnd && ! options.background) self._terminate();
  }

};

W.fakeCommand = function fakeCommand(command) {
  this.emit('command', command, [], {});
}

W.out = function out(what) {
  this.emit('stdout', what);
};

W._fullPath = function fullPath(dir) {
  return path.normalize(path.join('/tmp', dir));
};

W.reset = function reset() {
  this._endResults = undefined;
  this._pendingCommands = 0;
  this._endAfterCommandsEnd = false;
};

W.end = function end(data) {
  if (data) this._endResults = data;

  if (!this._pendingCommands) this._terminate();
  else {
    console.log('[worker] end() - still pending commands, not ending yet...'.yellow);
    this._endAfterCommandsEnd = true;
  }
};

W._terminate = function terminate() {
  if (! this._pendingCommands) this.executing = false;
  if (this._endResults) {
    this.emit('data', this._endResults);
    this._endResults = undefined;
  }
  this.emit('end');
};

W.dispose = function dispose() {
  this._backgroundCommands.forEach(function(command) {
    command.kill();
  });
}

W.error = function error(err) {
  console.error(err.stack || err);
  this.emit('error', err);
  this.end();
};
