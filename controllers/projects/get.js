var projects = require('../../db/projects');

module.exports = getProject;

function getProject(req, res, next) {
  var id = req.params.owner + '/' + req.params.repo;
  var user = req.session.userCtx.name;

  projects.get(id, replied);

  function replied(err, project) {
    if (err) res.send(err.status_code || 500, err);
    else if (! project) res.send(404, new Error('Not found'));
    else {
      if (project.public || project.owners.indexOf(user) >= 0)
        res.send(project);
      else res.send(404, new Error('Not Found'));
    }
  }
}