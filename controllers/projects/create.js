var Joi      = require('joi');
var extend   = require('util')._extend;
var projects = require('../../db/projects');

exports = module.exports = createProject;
exports.validate = validate;

/// Validate

/// PENDING: do a proper schema here
var schema = {
  repo:   Joi.string().required().min(3),
  branch: Joi.string().required().min(1),
};

function validate(req, res, next) {
  var err = Joi.validate(req.body, schema);
  if (err) res.send(400, err);
  else next();
}


/// Create

function createProject(req, res, next) {
  var project = extend({}, req.body);
  project.owners = [ req.session.userCtx.name ];
  projects.create(project, replied);

  function replied(err, reply) {
    if (err) res.send(err.status_code || 500, err);
    else res.send(reply);
  }
}