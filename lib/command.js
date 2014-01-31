var EventEmitter = require('events').EventEmitter;
var PassThrough  = require('stream').PassThrough;
var inherits     = require('util').inherits;
var spawn        = require('child_process').spawn;

module.exports = Command;

function Command(command, args, options) {
  EventEmitter.call(this);

  var self = this;

  this.stdout = new PassTrough();
  this.stderr = new PassTrough();

  var child = spawn(command, args, options);
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