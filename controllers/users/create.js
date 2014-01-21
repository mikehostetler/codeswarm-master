var Joi   = require('joi');
var users = require('../../db/users');

module.exports = create;
create.validate = validate;


/// Validate

var schema = {
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
};

function validate(req, res, next) {
  var err = Joi.validate(req.body, schema);
  if (err) res.send(400, err);
  else next();
}


/// Create

function create(req, res, next) {
  var user = {
    name: req.body.username,
    password: req.body.password
  };
  users.create(user, replied);

  function replied(err, reply) {
    if (err) res.send(err.status_code || 500, err);
    else res.send(reply);
  }
}