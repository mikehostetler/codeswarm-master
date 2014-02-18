var builds = require('../db/builds');

module.exports = buildBelongsToProject;

function buildBelongsToProject(req, res, next) {
  var project = req.project._id;
  if (! project) return res.send(404, new Error('Project not found'));
  var build = req.param('build');

  builds.get(project, build, replied);

  function replied(err, build) {
    if (err) res.send(err.status_code || 500, err);
    else if (! build) return res.send(404, new Error('Build not found'));
    else if (build.project != project) return res.send(404, new Error('No such build found in project'));
    else {
      req.build = build;
      next();
    }
  }
}