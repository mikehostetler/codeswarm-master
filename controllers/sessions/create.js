var Cookie = require('cookie');
var Joi    = require('joi');
var users  = require('../../db/users');

module.exports = create;
create.validate = validate;

var sessionExpirationMs = 1000 * 60 * 60 * 24 * 30; // 30 days
var cookieOptions = {
  path: '/',
  httpOnly: true,
  expires: new Date(Date.now() + sessionExpirationMs)
};

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
  users.authenticate(req.body.username, req.body.password, replied);

  function replied(err, sessionId) {
    if (err) res.send(err.status_code || 500, err);
    else if (! sessionId) res.send(500, new Error('No session id generated'));
    else {
      var cookie = Cookie.serialize('sid', sessionId, cookieOptions);
      res.setHeader('Set-Cookie', cookie);
      res.send({ session: sessionId });
    }
  }
}