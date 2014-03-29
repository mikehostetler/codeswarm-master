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
  if (err) {
    setTimeout(dequeue, 3000);
    err.message = 'Error while dequeueing:' + err.message;
    console.error(err.stack || err);
  } else {
    process.nextTick(dequeue);
    console.log('worker dequeued %j', job);
    build.work(job, done);
  }
}