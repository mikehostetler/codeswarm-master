var db      = require('./');

/// create

exports.create = createProject;

function createProject(project, cb) {

  console.log('project:', project);

  project = {
    repo:   project.repo,
    branch: project.branch,
    owners: project.owners
  };

  (function _createProject() {
    db.privileged('projects', function(err, db) {
      if (err) cb(err);
      else db.insert(project, project.repo, replied);
    });

    function replied(err, reply) {
      if (err && err.status_code == 404 && err.reason == 'no_db_file') {
        createProjectsDB(function(err) {
          if (err) cb(err);
          else _createProject();
        });
      } else {
        if (err && err.status_code == '409')
          err.message = 'Project already exists';
        cb(err, reply);
      }
    }
  })();
}

function createProjectsDB(cb) {
  db.privileged(function(err, db) {
    if (err) cb(err);
    else db.create('projects', replied);
  });

  function replied(err) {
    if (err && err.status_code == 404) cb();
    else cb(err);
  }
}