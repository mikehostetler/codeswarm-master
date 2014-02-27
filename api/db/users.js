var extend  = require('util')._extend;
var cookie  = require('cookie');
var db      = require('./');

var forbiddenUserNames = ['public', 'root', 'admin'];

/// create

exports.create = createUser;

function createUser(user, cb) {
  if (! user) throw new Error('Need user');
  if (! user.username) throw new Error('Need user.name');
  if (! user.password) throw new Error('Need user.password');

  if (forbiddenUserNames.indexOf(user.name) >= 0)
    return cb(new Error('Invalid user name'));

  var id = userId(user.username);

  user = {
    _id:      id,
    name:     user.username,
    type:     'user',
    roles:    [],
    password: user.password
  };

  db.privileged('_users', function(err, db) {
    if (err) cb(err);
    else {
      db.insert(user, id, replied);
    }
  });

  function replied(err, res, body) {
    if (err && err.status_code == '409')
      err.message = 'User already exists';
    cb(err, body);
  }
}


/// authenticate

exports.authenticate = authenticate;

function authenticate(username, password, callback) {
  db.public.auth(username, password, replied);

  function replied(err, body, headers) {
    console.log('AUTHENTICATE REPLY:', body);
    if (err) callback(err);
    else {
      var sessionId;
      var header = headers['set-cookie'][0];
      if (header) sessionId = cookie.parse(header).AuthSession;
      callback(null, sessionId, username, body.roles);
    }
  }
}


/// session-protected:

exports.session = session;

function session(db, username, sessionId) {
  var ret = {};
  var _users = db.use('_users');

  ret.remove = removeUser;

  return ret;

  function removeUser(cb) {
      var id = userId(username);
    _users.get(id, got);

    function got(err, user) {
      if (err) cb(err);
      else _users.destroy(id, user._rev, cb);
    }
  }

}


//// Common

exports.userId = userId;

function userId(id) {
  return 'org.couchdb.user:' + id;
}