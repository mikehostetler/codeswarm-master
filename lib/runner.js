var queue   = require('./queue');
var build   = require('./build');

exports.start = start;

function start() {
  dequeue();
}

function dequeue() {
  queue.pull(dequeued);
}

function dequeued(err, job, done) {
  process.nextTick(dequeue);
  if (err) {
    err.message = 'Error while dequeueing:' + err.message;
    console.error(err.stack || err);
  } else {
    console.log('worker dequeued %j', job);
    build.work(job, done);
  }
}