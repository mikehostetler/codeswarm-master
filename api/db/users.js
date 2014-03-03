var extend  = require('util')._extend;
var cookie  = require('cookie');
var joi     = require('joi');
var db      = require('./');

/// create

exports.create = createUser;

var userSchema = {
  fname: joi.string().required(),
  lname: joi.string(),
  email: joi.string().email().required(),
  password: joi.string().min(3)
};

function validateCreate(user) {
  return joi.validate(user, userSchema);
}

function createUser(user, cb) {

  var validationError = joi.validate(user, userSchema);
  if (validationError) return cb(validationError);

  var id = userId(user.email);

  console.log('ID:', id);

  user = {
    _id:       id,
    name:      user.email,
    fname:     user.fname,
    lname:     user.lname,
    email:     user.email,
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

function authenticate(email, password, callback) {
  db.public.auth(email, password, replied);

  function replied(err, body, headers) {
    console.log('AUTHENTICATE REPLY:', body);
    if (err) callback(err);
    else {
      var sessionId;
      var header = headers['set-cookie'][0];
      if (header) sessionId = cookie.parse(header).AuthSession;
      callback(null, sessionId, email, body.roles);
    }
  }
}


/// session-protected:

exports.session = session;

function session(db, email, sessionId) {
  var ret = {};
  var _users = db.use('_users');

  ret.remove = removeUser;

  return ret;

  function removeUser(cb) {
      var id = userId(email);
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