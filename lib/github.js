var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

/*passport.use(new GithubStrategy({
  clientID:     process.env.GITHUB_CLIENT_ID     || '38b4d7cbf60a13e29a2c',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || 'df305f1f836c81d2332e1d12f9a85b2d4faca783',
  callbackURL:  process.env.GITHUB_CALLBACK_URL  || 'http://localhost:1337/tokens/github/callback',
  scope: ['repo'],
  passReqToCallback: true
}, verify));*/

passport.use(new GithubStrategy({
  clientID:     process.env.GITHUB_CLIENT_ID     || 'f0bd67ea3cae427f1a4c',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '96e750cd9b483bf9b9022af5cd3ae34dae12bffa',
  callbackURL:  process.env.GITHUB_CALLBACK_URL  || 'http://milaju.com:1337/tokens/github/callback',
  scope: ['repo'],
  passReqToCallback: true
}, verify));

exports.authenticate = passport.authenticate('github');

exports.callback = passport.authenticate('github');

function verify(req, accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    req.session.token = accessToken;
    console.log('PROFILE:', profile);
    req.session.remoteUsername = profile.username;
    done(null, req.session.username());
  });
}