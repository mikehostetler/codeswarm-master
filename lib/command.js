var EventEmitter = require('events').EventEmitter;
var PassThrough  = require('stream').PassThrough;
var inherits     = require('util').inherits;
var spawn        = require('child_process').spawn;

module.exports = Command;

function Command(command, args, options) {
  console.log('[command] %s %s (%j)', command, (args || []).join(' '), options);
  EventEmitter.call(this);

  var self = this;

  this.stdout = new PassThrough();
  this.stderr = new PassThrough();

  var child = spawn(command, args, options);

  this._child = child;

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  this.stdout.setEncoding('utf8');
  this.stderr.setEncoding('utf8');
  child.stdout.pipe(this.stdout);
  child.stderr.pipe(this.stderr);
  child.once('error', onChildError);
  child.once('close', onChildClose);

  function onChildError(err) {
    self.emit('error', err);
  }

  function onChildClose(code) {
    self.emit('close', code);
  }
}

inherits(Command, EventEmitter);

var C = Command.prototype;

C.kill = function kill(signal) {
  this._child.kill(signal);
}