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

			var data,
				reqKey = requests.get("/api/deploykey"),
				hook = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");

			var loadProject = function (hook, key) {
				if (project !== "new") {

					var req = requests.get("/api/project/" + project);

					req.done(function (data) {
						data.hook = hook + "/deploy/" + data.dir;
						// Add key to data
						data.key = key;
						// Load project
						dom.loadProject(data);
					});

					req.fail(function () {
						dom.showError("Could not load project");
					});

				} else {
					data = {
						dir: "",
						repo: "",
						auth: false,
						state: false,
						hook: hook + "/deploy/",
						key: key
					};
					dom.loadProject(data);
				}
			};

			reqKey.done(function (key) {
				loadProject(hook, key);
			});

			reqKey.fail(function () {
				loadProject(hook, false);
			});

		}

	};

	return projects;

});
