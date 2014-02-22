var projects = require('../db/projects');

module.exports = hasValidProjectSecret;

function hasValidProjectSecret(req, res, next) {
  var projectId = req.param('owner') + '/' + req.param('repo');
  var secret = req.param('secret');

  projects.get(projectId, gotProject);

  function gotProject(err, project) {
    if (err) res.send(err.status_code || 500, err);
    else if (! project) res.send(404, new Error('No such project'));
    else if (! project.secret)
      res.send(500, new Error('This project has no .secret'));
    else if (secret != project.secret) {
      res.send(403, new Error('Secrets don\'t match'));
    } else {
      req.project = project;
      next();
    }
  }

}