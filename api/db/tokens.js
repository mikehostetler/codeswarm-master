var db      = require('./');
var users   = require('./users');

/// get

exports.get = getToken;

function getToken(user, provider, cb) {
  db.privileged('_users', function(err, _users) {
    if (err) cb(err);
    else {
      var username = users.userId(user); // internal couchdb username
      _users.get(username, replied);
    }
  });

  function replied(err, user) {
    if (err) cb(err);
    else {
      var token = user.tokens && user.tokens[provider];
      cb(null, token);
    }
  }
}


/// create

exports.create = createToken;

function createToken(username, provider, token, remoteUsername, cb) {
  db.privileged('_users', function(err, _users) {
    if (err) cb(err);
    else {
      _users.get(users.userId(username), gotUser);
    }

    function gotUser(err, user) {
      if (err) cb(err);
      else {
        if (! user.tokens) user.tokens = {};
        user.tokens[provider] = {
          token: token,
          username: remoteUsername
        };
        _users.insert(user, cb);
      }
    }
  });
}