module.exports = stageFunction;

function stageFunction(fn, context, build, worker, cb) {

  var ended = false;

  worker.reset();
  worker.once('end', onEnd);

  fn.call(null, build, worker, context);

  function onEnd() {

    if (!ended) {
      ended = true;
      cb();
    }
  }
}