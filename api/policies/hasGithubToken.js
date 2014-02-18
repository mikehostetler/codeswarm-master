module.exports = hasGithubToken;

var tokens = require('../db/tokens');

function hasGithubToken(req, res, next) {
  tokens.get(req.session.username(), 'github', gotToken);

  function gotToken(err, creds) {
    if (err) res.send(err.status_code || 500, err);
    else if (! creds) res.forbidden('requires github token');
    else {
      req.session.github = { creds: creds };
      next();
    }
  }
}