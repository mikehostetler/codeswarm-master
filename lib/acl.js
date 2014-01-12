/* global config */
var acl = function (token) {
	var projectName,
		project,
		projects = [];

	// Loop through projects and determine where token exists
	for (projectName in config.projects) {
		if (config.projects.hasOwnProperty(projectName)) {
			project = config.projects[projectName];
			if (project.state.hasOwnProperty("config")) {
				if (project.state.config.hasOwnProperty("notify")) {
					if (project.state.config.notify.indexOf(token) >= 0) {
						projects.push(projectName);
					}
				}
			}
		}
	}

	console.log(projects);

	if (projects.length) {
		return projects;
	} else {
		return false;
	}

};

module.exports = acl;
