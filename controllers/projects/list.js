var projects = require('../../db/projects');

module.exports = listProjects;

function listProjects(req, res, next) {
  if (req.session && req.session.userCtx.name) {
    projects.listFor(req.session.userCtx.name, replied);
  } else {
    res.send(403, new Error('You need to be logged in for now'));
  }

  function replied(err, projects) {
    if (err) res.send(err.status_code || 500, err);
    else res.send(projects);
  }
}