var db      = require('./');

/// list

exports.list = listBuilds;

function listBuilds(project, cb) {

  _list();

  function _list() {
    db.privileged('builds', function(err, db) {
      if (err) cb(err);
      else db.view('views', 'by_project', {keys: [project]}, replied);
    });
  }

  function replied(err, reply) {
    if (err && err.status_code == 404 && err.reason == 'missing') {
      createByProjectView(function(err) {
        console.log(err);
        if (err) cb(err);
        else _list();
      });
    }
    else if (err && err.status_code == 404 && err.reason == 'no_db_file') {
      createBuildsDB(function(err) {
        if (err) cb(err);
        else _list();
      });
    }
    else if (err) cb(err);
    else cb(null, reply.rows.map(prop('value')));
  }
}

function createBuildsDB(cb) {
  db.privileged(function(err, db) {
    if (err) cb(err);
    else db.db.create('builds', replied);
  });

  function replied(err) {
    if (err && err.status_code == 404) cb();
    else cb(err);
  }
}


function createByProjectView(cb) {
  db.privileged('builds', function(err, db) {
    if (err) cb(err);
    else {
      db.insert({
        'views': {
          'by_project': {
            'map':
              function(doc) {
                if (doc.project) {
                  emit(doc.project, doc);
                }
              }
          }
        }
      }, '_design/views', cb);
    }
  });
}


/// get

exports.get = getBuild;

function getBuild(project, build, cb) {

  _getBuild();

  function _getBuild() {
    db.privileged('builds', function(err, builds) {
      if (err) cb(err);
      else builds.get(build, replied);
    });
  }

  function replied(err, build) {
    if (err && err.status_code == 404 && err.reason == 'no_db_file') {
      createBuildsDB(function(err) {
        if (err) cb(err);
        else _getBuild();
      });
    }
    else if (err) cb(err);
    else {
      if (build && build.project != project)
        build = undefined;
      cb(null, build);
    }
  }
}


/// create

exports.create = createBuild;

function createBuild(build, cb) {

  _createBuild();

  function _createBuild() {
    db.privileged('builds', function(err, builds) {
      if (err) cb(err);
      else {
        builds.insert(build, inserted);
      }
    });

    function inserted(err, reply) {
      if (err && err.status_code == 404 && err.reason == 'no_db_file') {
        createBuildsDB(function(err) {
          if (err) cb(err);
          else _createBuild();
        });
      } else {
        console.log()
        build._id = reply.id;
        build._rev = reply.rev;
        cb(null, build);
      }
    }
  }
}


/// utils

function prop(p) {
  return function(o) {
    return o[p];
  }
}