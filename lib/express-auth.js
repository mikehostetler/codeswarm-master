/* global config */
var express = require("express"),
	expressAuth;

/**
 * BasicAuth with Project Config #####################################
 */

expressAuth = function (req, res, next) {
	var auth,
		basicAuth = express.basicAuth;
	if (config.projects.hasOwnProperty(req.params.project)) {
		// Get auth from project build settings
		auth = config.projects[req.params.project].auth;
		if (auth) {
			basicAuth(function (user, pass, callback) {
				// Check credentials
				callback(null, user === auth.user && pass === auth.pass);
			})(req, res, next);
		} else {
			// No authentication
			next();
		}
	}
};

module.exports = expressAuth;
