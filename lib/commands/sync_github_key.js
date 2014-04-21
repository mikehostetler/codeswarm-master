var async = require('async');
var keypair = require('ssh-keypair');
var github = require('../github');

var keyTitle = 'codeswarm-deploy-key';

module.exports = syncGithubKey;

function syncGithubKey(build, stage) {
  var token, project, repo, deployKeys, key;

  async.series([
    getProject,
    getGithubRepo,
    proceedIfGithubRepoIsPrivate,
    getGithubRepoDeployKeys,
    proceedIfGithubRepoDeployKeyIsNotPresent,
    createDeployKey,
    addDeployKeyToProject,
    pushGithubDeployKey
    ], done);

  function getProject(cb) {
    Project.findOne({id: build.project}, function(err, _project) {
      if (err) return cb(err);
      if (! _project) return cb(new Error('Project ' + build.project + ' not found'));
      project = _project;
      cb();
    });
  }

  function getGithubRepo(cb) {
    var owner = project.owners && project.owners[0];
    if (! owner) return cb(new Error('project needs an owner'));

    User.tokenFor(owner, 'github', gotToken);

    function gotToken(err, _token) {
      if (err) return cb(err);
      if (! _token) return cb(new Error('user has no token'));

      token = _token;

      github.getRepo(build.project, token.token, gotRepo);
    }

    function gotRepo(err, _repo) {
      if (err) return cb(err);
      repo = _repo;
      cb();
    }
  }

  function proceedIfGithubRepoIsPrivate(cb) {
    if (repo.private) cb();
    else done();
  }

  function getGithubRepoDeployKeys(cb) {
    github.repoDeployKeys(build.project, token.token, function(err, _deployKeys) {
      if (err) return cb(err);
      deployKeys = _deployKeys;
      cb();
    });
  }

  function proceedIfGithubRepoDeployKeyIsNotPresent(cb) {
    var contains = deployKeys.some(containsCodeswarmDeployKey);
    if (! contains) cb();
    else done();
  }

  function createDeployKey(cb) {
    keypair(token.username, function(err, privateKey, publicKey) {
      if (err) return cb(err);
      key = {
        public: publicKey,
        private: privateKey
      };
      cb();
    });
  }

  function addDeployKeyToProject(cb) {
    project.github_deploy_key = key;
    project.save(cb);
  }

  function pushGithubDeployKey(cb) {
    github.createDeployKey(build.project, keyTitle, key.public, token.token, cb);
  }

  function done(err) {
    if (err) stage.error(err);
    else stage.end();
  }
}

function containsCodeswarmDeployKey(key) {
  return key.title == keyTitle;
}