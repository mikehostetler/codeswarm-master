var passport = module.exports = require('passport');

passport.serializeUser(function(username, done) {
  done(null, username);
});

passport.deserializeUser(function(username, done) {
  User.findOne({id: 'org.couchdb.user:' + username}, done);
});