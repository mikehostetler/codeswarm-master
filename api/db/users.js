var extend  = require('util')._extend;
var cookie  = require('cookie');
var joi     = require('joi');
var db      = require('./');

/// create

exports.create = createUser;

var userCreateSchema = {
  fname: joi.string().required(),
  lname: joi.string(),
  email: joi.string().email().required(),
  password: joi.string().min(3)
};

function createUser(user, cb) {

  var validationError = joi.validate(user, userCreateSchema);
  if (validationError) return cb(validationError);

  var id = userId(user.email);

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


/// get

exports.get = getUser;

function getUser(email, cb) {
  db.privileged('_users', function(err, users) {
    if (err) cb(err);
    else users.get(userId(email), replied);
  });

  function replied(err, user) {
    if (err) cb(err);
    else cb(null, forReply(user));
  }
}


/// update

exports.update = updateUser;

function updateUser(email, attrs, cb) {

  // delete forbidden attribute updates
  delete attrs._id;
  delete attrs.id;
  delete attrs.roles;
  delete attrs.type;
  delete attrs.email;

  db.privileged('_users', function(err, users) {
    users.get(userId(email), gotUser);

    function gotUser(err, user) {
      if (err) cb(err);
      else {
        extend(user, attrs);
        delete attrs.salt;
        delete attrs.password_scheme;
        delete attrs.derived_key;
        delete attrs.iterations;

        users.insert(user, user._id, cb);
      }
    }
  });

}


/// authenticate

exports.authenticate = authenticate;

function authenticate(email, password, callback) {
  db.public.auth(email, password, replied);

  function replied(err, body, headers) {
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

function forReply(user) {
  delete user._id;
  delete user.derived_key;
  delete user.iterations;
  delete user.password_scheme;
  delete user.salt;

  return user;
}