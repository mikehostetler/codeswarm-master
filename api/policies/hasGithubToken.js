module.exports = hasGithubToken;

function hasGithubToken(req, res, next) {
  User.tokenFor(req.session.username(), 'github', gotToken);

  function gotToken(err, creds) {
    if (err) res.send(err.status_code || 500, err);
    else if (! creds) res.forbidden('requires github token');
    else {
      req.session.github = { creds: creds };
      next();
    }
  }
}