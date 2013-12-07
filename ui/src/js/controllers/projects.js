define([
	"controllers/dom",
	"controllers/requests"
], function (dom, requests) {

	var projects = {

		showList: function () {

			var req = requests.get("/api/projects");

			req.done(function (data) {
				dom.loadProjects(data);
			});

			req.fail(function () {
				dom.showError("Could not load projects");
			});
		},

		showProject: function (project) {

			var req = requests.get("/api/project/" + project);

			req.done(function (data) {
				dom.loadProject(data);
			});

			req.fail(function () {
				dom.showError("Could not load project");
			});

		}

	};

	return projects;

});
