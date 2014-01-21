var Joi      = require('joi');
var projects = require('../../db/projects');

exports = module.exports = createProject;
exports.validate = validate;

/// Validate

/// PENDING: do a proper schema here
var schema = {
  dir:    Joi.string(),
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
  projects.create(req.body, replied);

  function replied(err, reply) {
    if (err) res.send(err.status_code || 500, err);
    else res.send(reply);
  }
}