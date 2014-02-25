module.exports = stageFunction;

function stageFunction(fn, context, config, build, worker, previousBuild, cb) {

  var ended = false;

  worker.reset();
  worker.on('end', onEnd);
  worker.on('close', onClose);
  worker.on('error', onError);

  fn.call(null, build, worker, config, context, previousBuild);

  function onEnd() {
    teardown();
  }

  function onClose(code) {
    var err;
    if (code != 0) teardown(new Error('Exit code was ' + code));
  }

  function onError(err) {
    teardown(err);
  }

  function teardown(err) {
    if (!ended) {
      worker.removeListener('end', onEnd);
      worker.removeListener('close', onClose);
      worker.removeListener('error', onError);
      ended = true;
      cb(err);
    }
  }
}