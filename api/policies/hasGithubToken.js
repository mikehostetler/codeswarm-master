module.exports = function hasGithubToken(req, res, next) {
  User.tokenFor(req.user.username, 'github', gotToken);

	sails.log.silly("Policy::hasGithubToken - ",req.user);

  function gotToken(err, creds) {
    if (err) res.send(err.status_code || 500, err);
    else if (! creds) res.forbidden('requires github token');
    else {
      req.session.github = { creds: creds };
      next();
    }
  }
}
