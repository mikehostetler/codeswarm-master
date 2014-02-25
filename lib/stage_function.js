module.exports = stageFunction;

function stageFunction(fn, context, config, build, worker, previousBuild, cb) {

  var ended = false;

  worker.reset();
  worker.once('end', onEnd);

  fn.call(null, build, worker, config, context, previousBuild);

  function onEnd() {

    if (!ended) {
      ended = true;
      cb();
    }
  }
}