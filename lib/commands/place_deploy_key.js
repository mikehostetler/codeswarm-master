var shelly = require('shelly');

module.exports = placeDeployKey;

function placeDeployKey(build, stage) {
  async.waterfall([
    getProject,
    ensureDeployKey,
    placeDeployKey
    ], done);

  function getProject(cb) {
    Project.findOne({id: build.project}, cb);
  }

  function ensureDeployKey(project, cb) {
    var key = project.github_deploy_key;
    var err;
    if (! key) cb(new Error('No project deploy key found'));
    else cb(null, key);
  }

  function placeDeployKey(key, cb) {
    var args = shelly('echo ? > ?', key, '/tmp/id-build-' + build.id)
    stage.command('bash', )
  }
}