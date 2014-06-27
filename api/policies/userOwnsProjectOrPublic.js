module.exports = function userOwnsProjectOrPublic(req, res, next) {
  var user = req.user.username;
	var id = req.param('project-id');	

	sails.log.debug("Policy::userOwnsProjectOrPublic - ",user,id);

  Project.findOne({id: id}, replied);
  function replied(err, project) {
    if (err) res.send(err.status_code || 500, err);
    else if (! project) res.send(404, new Error('Project not found'));
    else if (project.public) {
      req.project = project;
      next();
    } else if (project.owners.indexOf(user) < 0)
      res.forbidden(403, new Error('You don\'t own that project'));
    else {
      req.project = project;
      next();
    }
  }
}
