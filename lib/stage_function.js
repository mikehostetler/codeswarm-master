module.exports = stageFunction;

function stageFunction(fn, context, build, worker, previousBuild, cb) {

  var ended = false;

  worker.reset();
  worker.once('end', onEnd);

  fn.call(null, build, worker, context, previousBuild);

  function onEnd() {

    if (!ended) {
      ended = true;
      cb();
    }
  }
}