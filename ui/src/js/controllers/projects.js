define([
	"controllers/dom",
	"controllers/requests",
	"controllers/session",
	"controllers/router",
	"controllers/timestamp"
], function (dom, requests, session, Router, timestamp) {
	var router,
		projects;

	router = new Router();

	projects = {

		showList: function () {

			var self = this,
				req = requests.get("/api/projects/"),
				acl_data = {},
				base_href = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");

			req.done(function (data) {
				var proj;
				// Check for state and format timestamp
				for (proj in data) {
					if (data[proj].state) {
						data[proj].state.timestamp = timestamp(data[proj].state.id);
						data[proj].view = base_href + "/view/" + data[proj].dir + "/";
					}
				}

				dom.loadProjects(data, self);
			});

			req.fail(function () {
				dom.showError("Could not load projects");
			});
		},

		runBuild: function (project) {
			var req = requests.post("/deploy/" + project);

			req.done(function (data) {
				dom.showSuccess("Starting build...");
				// Pause to allow build to start, then redirect
				setTimeout(function () {
					router.go("/logs/" + project + "/" + data.build);
				}, 2000);
			});

			req.fail(function () {
				dom.showError("Could not start build");
			});

		},

		showProject: function (project) {

			var self = this,
				loadProject,
				data,
				reqKey = requests.get("/api/deploykey/"),
				hook = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");

			loadProject = function (hook, key) {
				var req;
				if (project !== "new") {

					req = requests.get("/api/project/" + project);

					req.done(function (data) {
						data.hook = hook + "/deploy/" + data.dir;
						// Add key to data
						data.key = key;
						// Load project
						dom.loadProject(data, self);
					});

					req.fail(function () {
						dom.showError("Could not load project");
					});

				} else {
					data = {
						dir: "new-project",
						repo: "",
						branch: "",
						auth: false,
						state: false,
						hook: hook + "/deploy/new-project",
						key: key
					};
					dom.loadProject(data, self);
				}
			};

			reqKey.done(function (key) {
				loadProject(hook, key);
			});

			reqKey.fail(function () {
				loadProject(hook, false);
			});

		},

		saveProject: function (data) {
			var req;
			// Set auth object
			// Set blank branch to master
			data.branch = (data.branch === "") ? "master" : data.branch;
			// Send to API
			if (!data._id) {

				req = requests.post("/api/projects", {
					repo: data.repo,
					branch: data.branch || "master"
				});

				req.done(function () {
					dom.showSuccess("Project successfully created");
					// Update ID field
					dom.$main.find("input[name=\"_id\"]").val(data.name);
				});

				req.fail(dom.showXhrError);
			} else {
				// Modify object
				req = requests.post("/api/projects/" + data._id, data);

				req.done(function () {
					dom.showSuccess("Project successfully saved");
				});

				req.fail(dom.showXhrError);
			}
		},

		deleteProject: function (name) {
			var req = requests.delete("/api/project/" + name);

			req.done(function () {
				router.go("/projects");
				dom.showSuccess("Project successfully deleted");
			});

			req.fail(function () {
				dom.showError("Could not delete project");
			});
		}

	};

	return projects;

});
