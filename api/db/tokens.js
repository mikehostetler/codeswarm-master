var db      = require('./');
var users   = require('./users');

/// get

exports.get = getToken;

function getToken(user, provider, cb) {
  db.privileged('_users', function(err, _users) {
    if (err) cb(err);
    else {
      var email = users.userId(user); // internal couchdb username
      _users.get(email, replied);
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

function createToken(email, provider, token, remoteUsername, cb) {
  db.privileged('_users', function(err, _users) {
    if (err) cb(err);
    else {
      _users.get(users.userId(email), gotUser);
    }

    function gotUser(err, user) {
      if (err) cb(err);
      else {
        if (! user.tokens) user.tokens = {};
        user.tokens[provider] = {
          token: token,
          email: remoteUsername
        };
        _users.insert(user, cb);
      }
    }
  });
}