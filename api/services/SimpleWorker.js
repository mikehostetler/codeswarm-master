var inherits = require('util').inherits;
var os       = require('os');
var path     = require('path');
var EE2      = require('eventemitter2').EventEmitter2;
var mkdirp   = require('mkdirp');
var extend   = require('util')._extend;
var Command  = require('./Command');

function Worker(build) {
  if (!this instanceof Worker) 
		return new Worker(build);

  EE2.call(this);
  this._backgroundCommands = [];
  this.executing = false;
  this.build = build;
  this.reset();
}

inherits(Worker, EE2);

Worker.prototype.init = function init(image, cb) {
  // nothing to see here, move on...
  process.nextTick(cb);
};

Worker.prototype.command = function command(command, args, options) {
  var self = this;
  var closed = false;

  options = extend({}, options || {});

  if (typeof options.cwd == 'undefined')
    options.cwd = this.build.dir;

  if (options.cwd.charAt(0) != '/')
    options.cwd = this._fullPath(options.cwd);

	sails.log.silly(' * * * * [WORKER] Worker issuing command: %s %s (%j)'.yellow, command, args.join(' '), options);

  var background = options.background || options.silent;
  if (self.executing && !background) 
		throw new Error('Worker already executing command, parallel commands not allowed. Was trying to execute command ' + command);

  if (!background) {
    self.executing = true;
    self._pendingCommands ++;
  }

  if (!background)
    self.emit('command', command, args, options);

  var child = new Command(command, args, options);

  if (background) self._backgroundCommands.push(child);

  if (! background) {
    child.stdout.on('data', onChildStdoutData);
    child.stderr.on('data', onChildStderrData);
  }

  child.once('close', onChildClose);
  child.once('exit', onChildClose);

  return child;

  function onChildStdoutData(data) {
    process.stdout.write('[worker] stdout: ' + data);
    self.emit('stdout', data);
  }

  function onChildStderrData(data) {
    process.stdout.write('[worker] stderr: ' + data);
    self.emit('stderr', data);
  }

  function onChildClose(code) {
    if (! closed) {
      closed = true;

      if (!background) self.executing = false;

      if (background) {
        var idx = self._backgroundCommands.indexOf(child);
        if (idx >= 0) {
          self._backgroundCommands.splice(idx, 1);
        }
      }

      if (! background) {
        self._pendingCommands --;
        if (! self._pendingCommands && self._endAfterCommandsEnd)
          self._terminate();

        if (code != 0) self.emit('error', new Error('Command exited with error code ' + code));
        self.emit('close', code);
      }
    }
  }

};

Worker.prototype.fakeCommand = function fakeCommand(command) {
  this.emit('command', command, [], {});
}

Worker.prototype.out = function out(what) {
  this.emit('stdout', what);
};

Worker.prototype._fullPath = function fullPath(dir) {
  return path.normalize(path.join('/tmp', dir));
};

Worker.prototype.reset = function reset() {
  this._endResults = undefined;
  this._pendingCommands = 0;
  this._endAfterCommandsEnd = false;
};

Worker.prototype.end = function end(data, force) {
  if (data) this._endResults = data;

  if (!this._pendingCommands || force) {
		sails.log.silly(' * * * * [WORKER] end() - All commands complete!'.yellow);
		this._terminate();
	}
  else {
		sails.log.silly(' * * * * [WORKER] end() - Still pending commands, not ending yet...'.yellow);
    this._endAfterCommandsEnd = true;
  }
};

Worker.prototype._terminate = function terminate() {
  if (! this._pendingCommands) this.executing = false;
  if (this._endResults) {
    this.emit('data', this._endResults);
    this._endResults = undefined;
  }
  this.emit('end');
};

Worker.prototype.dispose = function dispose() {
  this._backgroundCommands.forEach(function(command) {
		sails.log.silly(' * * * * [WORKER] dispose() - killing all commends ...'.yellow);
    command.kill();
  });
}

Worker.prototype.error = function error(err) {
  console.error(err.stack || err);
  this.emit('error', err);
  this.end(null, true);
};

module.exports = Worker;
