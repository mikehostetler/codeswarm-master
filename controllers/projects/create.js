var Joi      = require('joi');
var extend   = require('util')._extend;
var projects = require('../../db/projects');

exports = module.exports = createProject;
exports.validate = validate;

/// Validate

var repoRegexp = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?\.git$/;

/// PENDING: do a proper schema here
var schema = {
  repo:   Joi.string().required().regex(repoRegexp),
  branch: Joi.string().required(),
};

function validate(req, res, next) {
  var err = Joi.validate(req.body, schema);
  if (err) res.send(400, err);
  else next();
}


/// Create

function createProject(req, res, next) {
  var project = extend({}, req.body);
  var match = project.repo.match(repoRegexp);
  var id = match[5];
  project._id = id;
  project.owners = [ req.session.userCtx.name ];
  projects.create(project, replied);

  function replied(err, reply) {
    if (err) res.send(err.status_code || 500, err);
    else res.send(201, reply);
  }
}