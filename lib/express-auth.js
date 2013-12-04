var express = require("express");

/**
 * BasicAuth with Project Config #####################################
 */

var expressAuth = function (req, res, next) {
	var basicAuth = express.basicAuth;
	if (config.builds.hasOwnProperty(req.params.project)) {
		// Get auth from project build settings
		var auth = config.builds[req.params.project].auth;
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
