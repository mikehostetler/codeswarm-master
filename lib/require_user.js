module.exports = requireUser;

function requireUser(req, res, next) {
  if (req.session && req.session.userCtx && req.session.userCtx.name) next();
  else res.send(403, new Error('Requires logged in user'));
}