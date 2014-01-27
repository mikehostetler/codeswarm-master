var projects = require('../../db/projects');

module.exports = checkOwnerOrPublic;

function checkOwnerOrPublic(req, res, next) {
  var user = req.session.userCtx.name;
  var project = req.project;
  if (! project) res.send(404, new Error('Not found'));
  else {
    if (project.public || project.owners.indexOf(user) >= 0)
      next();
    else res.send(404, new Error('Not found'));
  }
}
