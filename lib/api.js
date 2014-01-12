/* global config */
var api = {},
	fs = require("fs"),
	fse = require("fs-extra"),
	configuration = require("./configuration.js");

/**
 * Controls all API methods ##########################################
 */

/**
 * Responds to GET requests
 */

api.get = function (req, res) {
	var project,
		log,
		regex,
		match,
		token,
		results;
	switch (req.params.type) {
	case "token":
		// Process token submission
		token = req.params[0];
		if (config.app.tokens.indexOf(token) >= 0) {
			res.send(200, {
				session: new Date().getTime()
			});
		} else {
			res.send(404, "Bad Token");
		}
		break;
	case "projects":
		// Return projects
		res.send(config.projects);
		break;
	case "project":
		// Return individual project
		project = req.params[0];
		if (config.projects.hasOwnProperty(project)) {
			res.send(200, config.projects[project]);
		} else {
			res.send(404, "Project not found");
		}
		break;
	case "logs":
		// Return logs
		project = req.params[0];
		fs.readFile(config.app.logs + project + "/index", function (err, data) {
			if (err) {
				res.send(404, "Could not get log files");
			} else {
				regex = /([\w-]+)\-([\w-]+)/g;
				results = {};

				while ((match = regex.exec(data)) !== null) {
					results[match[1]] = match[2];
				}

				res.send(200, results);
			}
		});
		break;
	case "log":
		// Return individual log
		log = req.params[0];
		fs.readFile(config.app.logs + log + ".log", function (err, data) {
			if (err) {
				res.send(404, "Could not retrieve log");
			} else {
				res.send(data);
			}
		});
		break;
	case "deploykey":
		// Get deploy key contents
		fs.readFile("deploy_key", function (err, data) {
			if (err) {
				res.send(404, "Could not retrieve key");
			} else {
				res.send(200, data);
			}
		});
	}
};

/**
 * Responds to POST requests
 */

api.post = function (req, res) {
	var project;
	switch (req.params.type) {
	case "project":
		project = req.params[0];
		if (config.projects.hasOwnProperty(project)) {
			try {
				config.projects[project].auth = req.body.auth;
				config.projects[project].branch = req.body.branch;
			} catch (e) {
				res.send(500, e.message);
			}
			res.send(200, "Project saved");
		} else {
			res.send(404, "Project does not exist");
		}
		break;
	}
};

/**
 * Responds to PUT requests
 */

api.put = function (req, res) {
	switch (req.params.type) {
	case "project":
		if (!config.projects.hasOwnProperty(req.body.dir)) {
			config.projects[req.body.dir] = {
				dir: req.body.dir,
				repo: req.body.repo,
				auth: req.body.auth,
				branch: req.body.branch
			};
			configuration.set(config);
			res.send(200, "Project created");
		} else {
			res.send(404, "Project already exists");
		}
		break;
	}
};

/**
 * Responds to DELETE requests
 */

api.del = function (req, res) {
	var project;
	switch (req.params.type) {
	case "project":
		// Permanently delete a project
		project = req.params[0];
		// Delete build directory
		fse.remove(config.app.builds + config.projects[project].dir);
		// Delete log directory
		fse.remove(config.app.logs + config.projects[project].dir);
		// Delete project
		delete config.projects[project];
		configuration.set(config);
		res.send(200, "Project deleted");
		break;
	}
};

// Export
module.exports = api;
