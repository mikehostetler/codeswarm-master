var async = require('async');

module.exports = checkout;

function checkout(build, worker) {
  async.series([
    clone,
    checkout],
    done);

  function clone(cb) {
    worker.command('git', ['clone', build.repo, '.']).once('close', function(code) {
      if (code != 0) cb(new Error('git clone command exited with status code ' + code));
      else cb();
    });
  }

  function checkout(cb) {
    worker.command('git', ['reset', '--hard', build.commit]).once('close', function(code) {
      if (code != 0) cb(new Error('git reset command exited with status code ' + code));
      else cb();
    });
  }

  function done(err) {
    if (err) worker.emit('error', err);
    worker.end();
  }
}