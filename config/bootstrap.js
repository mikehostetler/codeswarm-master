/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var async = require('async');
var queue = require('../lib/queue');

module.exports.bootstrap = function (cb) {

  async.series([
      initQueue,
      initPlugins,
      startWorker,
    ], initialized);

  function initQueue(cb) {
    queue.init(cb);
  }

  function initPlugins(cb) {
    require('../lib/plugins').init(cb);
  }

  function startWorker(cb) {
    if (process.env.NODE_ENV != 'production') {
      console.log('Since we\'re not in production mode, I\'m going to start a worker right here...');
      var runner = require('../lib/runner');
      runner.start();
    }

    process.nextTick(cb);
  }

  function initialized(err) {
    if (err) throw err;
    cb();
  }
};

