var inherits = require('util').inherits;
var EE2      = require('eventemitter2').EventEmitter2;
var Command  = require('./command');

module.exports = Worker;

function Worker(worker) {
  if (! this instanceof Worker) return new Worker();
  EE2.call(this);
}

inherits(Worker, EE2);

var W = Worker.prototype;

W.command = function command(command, args, options) {
  var self = this;
  self.emit('command', command, args, options);
  var child = new Command(command, args, options);
  child.stdout.on('data', onChildStdoutData);
  child.stderr.on('data', onChildStderrData);
  child.once('clse', onChildClose);

  function onChildStdoutData(d) {
    self.emit('stdout', d);
  }

  function onChildStderrData(d) {
    self.emit('stderr', d);
  }

  function onChildClose(code) {
    self.emit('close', code);
    self.emit('end');
  }
};