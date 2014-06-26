/**
 * CodeSwarm Base Plugin
 *
 * This is the base plugin to handle the most basic checkout of a repository and creation of local environment
 */

var async = require('async');

/// init
exports.init = function init(cb) {
	cb();
}

exports.workerImage = 'node';

exports.wipe   = function wipe(build, worker) {
  worker.command('rm', ['-rf', build.dir], { cwd: ''});
  worker.end();
}

exports.mkdirp = function mkdirp(build, worker) {
  worker.command('mkdir', ['-p', build.dir], { cwd: ''});
  worker.end();
}

exports.clone  = function clone(build, worker) {
  async.series([
			function clone(cb) {
				worker.command('git', ['clone', build.repo, '.']).once('close', function(code) {
					if (code != 0) 
						cb(new Error('git clone command exited with status code ' + code));
					else cb();
				});
			},
			function checkout(cb) {
				worker.command('git', ['reset', '--hard', build.commit]).once('close', function(code) {
					if (code != 0) 
						cb(new Error('git reset command exited with status code ' + code));
					else cb();
				});
			}
		],
		function done(err) {
			if (err) worker.emit('error', err);
			worker.end();
		});
}

exports.info   = require('./commit_info');

exports.purge  = function purge(build, worker) {
  worker.command('rm', ['-rf', build.dir], {cwd: build.dir + '/..'});
  worker.end();
}
