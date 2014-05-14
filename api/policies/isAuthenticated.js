/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
	//sails.log.debug('API -> Policies -> isAuthenticated.js -> Checking req.user policy on request!',req.user);
  if (req.user) {
		next();
	}
  else res.send(401, new Error('You are not permitted to perform this action.'));
};
