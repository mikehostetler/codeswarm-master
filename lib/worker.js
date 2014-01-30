var queue = require('./queue');

exports.start = start;

function start() {
  dequeue();
}

function dequeue() {
  queue.pull(dequeued);
}

function dequeued(err, message, done) {
  if (err) {
    err.message = 'Error while dequeueing:' + err.message;
    console.error(err.stack || err);
  } else {
    console.log('worker dequeued %j', message);
    setTimeout(function() {
      console.log('work is done');
      done();
    }, 5000);
  }
}