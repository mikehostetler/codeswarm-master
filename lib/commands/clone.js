var async = require('async');
var shelly = require('shelly');

module.exports = checkout;



function checkout(build, worker) {
  async.waterfall([
    getProject,
    clone,
    checkout],
    done);

  function getProject(cb) {
    Project.findOne({id: build.project}, cb);
  }

  function clone(project, cb) {
    var identityFile = '/tmp/id-build-' + build.id;
    var gitCommand = 'git clone ' + build.repo + ' .';
    var cmd;
    if (project.github_deploy_key)
      cmd = shelly('ssh -i ? -o StrictHostKeyChecking=no ?', identityFile, gitCommand);
    else
      cmd = shelly('ssh -o StrictHostKeyChecking=no ?', gitCommand);

    worker.command('bash', ['-c', cmd]).once('close', function(code) {
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