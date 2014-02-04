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
  this.build = build;
  EE2.call(this);
}

inherits(Worker, EE2);

var W = Worker.prototype;

W.command = function command(command, args, options) {
  var self = this;

  self.initialized(initialized);

  function initialized(err) {
    if (err) console.error(err.stack || err);

    options = extend({}, options);
    options.cwd = path.normalize(path.join(self.cwd(), options.cwd || ''));

    self.emit('command', command, args, options);
    var child = new Command(command, args, options);
    child.stdout.on('data', onChildStdoutData);
    child.stderr.on('data', onChildStderrData);
    child.once('close', onChildClose);

    function onChildStdoutData(d) {
      process.stdout.write('[worker] stdout: ' + d);
      self.emit('stdout', d);
    }

    function onChildStderrData(d) {
      process.stdout.write('[worker] stderr: ' + d);
      self.emit('stderr', d);
    }

    function onChildClose(code) {
      console.log('[worker] child closed with code %d', code);
      self.emit('close', code);
      if (code != 0) self.emit('error', new Error('Command exited with error code ' + code));
      self.emit('end');
    }

  }

};

W.initialized = function initialized(cb) {
  var cwd = this.cwd();
  console.log('MKDIRP', cwd);
  mkdirp(cwd, cb);
};

W.cwd = function cwd() {
  return path.join(os.tmpdir(), this.build.dir);
};

W.end = function end() {
  this.emit('end');
};