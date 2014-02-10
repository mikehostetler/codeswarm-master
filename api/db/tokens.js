var db      = require('./');
var users   = require('./users');

/// get

exports.get = getToken;

function getToken(user, provider, cb) {
  console.log('getToken', arguments);
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
      console.log('GIT USER tokens', user.tokens);
      var token = user.tokens && user.tokens[provider];
      cb(null, token);
    }
  }
}


/// create

exports.create = createToken;

function createToken(username, provider, token, cb) {
  db.privileged('_users', function(err, _users) {
    if (err) cb(err);
    else {
      _users.get(users.userId(username), gotUser);
    }

    function gotUser(err, user) {
      if (err) cb(err);
      else {
        if (! user.tokens) user.tokens = {};
        user.tokens[provider] = token;
        _users.insert(user, cb);
      }
    }
  });
}