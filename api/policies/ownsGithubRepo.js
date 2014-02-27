var Github = require('github');

var repoRegexp = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?\.git$/;

module.exports = ownsGithubRepo;

function ownsGithubRepo(req, res, next) {

  if (req.session.hasRole('admin')) return next();

  var repo = req.body && req.body.repo;
  if (! repo) return next();

  var match = repo.match(repoRegexp);
  if (! match) return res.send(409, new Error('Invalid repo URL'));
  repo = match[5];

  var repoParts = repo.split('/');

  var github = new Github({ version: '3.0.0' });
  github.authenticate({
    type: 'oauth',
    token: req.session.github.creds.token
  });

  var options = {
    user: repoParts[0],
    repo: repoParts[1]
  };

  console.log('Fetching github repo for inspection: %j', options);

  github.repos.get(options, replied);

  function replied (err, ghRepo) {
    if (err) {
      console.error(err.stack || err);
      return res.send(500, err);
    }
    if (! ghRepo.permissions.admin) res.send(403, new Error('You are not an admin of ' + repo));
    else next();

  }
}