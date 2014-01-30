/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var queue = require('../lib/queue');

module.exports.bootstrap = function (cb) {

  queue.init(initializedQueue);

  function initializedQueue(err) {
    if (err) throw err;
    else {

      if (process.env.NODE_ENV != 'production') {
        console.log('Since we\'re not in production mode, I\'m going to start a worker right here...');
        startWorker();
      }

      cb();
    }
  }
};

function startWorker() {
  var worker = require('../lib/worker');
  worker.start();
}