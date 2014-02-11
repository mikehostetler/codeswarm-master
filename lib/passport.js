var db = require('../api/db');

var passport = module.exports = require('passport');

passport.serializeUser(function(username, done) {
  done(null, username);
});

passport.deserializeUser(function(username, done) {
  db.privileged('_users', function(err, _users) {
    if (err) done(err);
    else _users.get(username, done);
  });
});