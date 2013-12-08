var fs = require("fs");

/**
 * Controls all API methods ##########################################
 */

var api = {};

/**
 * Responds to GET requests
 */

api.get = function (req, res) {
	var project, log;
	switch (req.params.type) {
		// Process token submission
	case "token":
		var token = req.params[0];
		if (config.app.tokens.indexOf(token) >= 0) {
			res.send(200, {
				session: new Date().getTime()
			});
		} else {
			res.send(404, "Bad Token");
		}
		break;
		// Return all tokens
	case "tokens":
		res.send(config.app.tokens);
		break;
		// Return projects
	case "projects":
		res.send(config.projects);
		break;
		// Return individual project
	case "project":
		project = req.params[0];
		if (config.projects.hasOwnProperty(project)) {
			res.send(200, config.projects[project]);
		} else {
			res.send(404, "Project not found");
		}
		break;
		// Return logs
	case "logs":
		project = req.params[0];
		fs.readFile(config.app.logs + project + "/index", function (err, data) {
			if (err) {
				res.send(404, "Could not get log files");
			} else {
				var regex = /([\w-]+)\-([\w-]+)/g;
				var match, results = {};

				while ((match = regex.exec(data)) !== null) {
					results[match[1]] = match[2];
				}

				res.send(200, results);
			}
		});
		break;
		// Return individual log
	case "log":
		log = req.params[0];
		fs.readFile(config.app.logs + log + ".log", function (err, data) {
			if (err) {
				res.send(404, "Could not retrieve log");
			} else {
				res.send(data);
			}
		});
		break;
	}
};

/**
 * Responds to POST requests
 */

api.post = function (req, res) {
	res.send("POST!");
};

/**
 * Responds to PUT requests
 */

api.put = function (req, res) {
	res.send("PUT");
};

/**
 * Responds to DELETE requests
 */

api.del = function (req, res) {
	res.send("DELETE");
};

// Export
module.exports = api;
