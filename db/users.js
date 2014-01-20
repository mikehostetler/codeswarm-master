/**************************************
,--. ,--.
|  | |  | ,---.  ,---. ,--.--. ,---.
|  | |  |(  .-' | .-. :|  .--'(  .-'
'  '-'  '.-'  `)\   --.|  |   .-'  `)
 `-----' `----'  `----'`--'   `----'
***************************************/


var extend  = require('util')._extend;
var cookie  = require('cookie');
var couch   = require('./');
var _users  = couch.db.use('_users');


/// create

exports.create = createUser;

function createUser(user, cb) {
  if (! user) throw new Error('Need user');
  if (! user._id) throw new Error('Need user._id');
  if (! user.password) throw new Error('Need user.password');

  var id = 'org.couchdb.user:' + user._id;

  // Unfortunately can't seam to be able to use nano here
  // since couchdb is expecting a non-escaped ':' character in the URL...

  user = {
    _id: id,
    name:     user._id,
    type:     'user',
    roles:    [],
    password: user.password
  };

  _users.insert(user, id, replied);


  function replied(err) {
    if (err && err.status_code == '409')
      err.message = 'User already exists';
    cb(err);
  }
}


/// authenticate

exports.authenticate = authenticate;

function authenticate(username, password, callback) {
  couch.auth(username, password, replied);

  function replied(err, body, headers) {
    if (err) callback(err);
    else {
      var sessionId;
      var header = headers['set-cookie'][0];
      if (header) sessionId = cookie.parse(header).AuthSession;
      callback(null, sessionId);
    }
  }
}

