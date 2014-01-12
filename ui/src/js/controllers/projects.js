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
				// Check ACL
				session.getACL(function (acl) {
					if (acl.projects === "all") {
						dom.loadProjects(data, self);
					} else {
						for (var i = 0, z = acl.projects.length; i < z; i++) {
							acl_data[acl.projects[i]] = data[acl.projects[i]];
						}
						dom.loadProjects(acl_data, self, true);
					}
				});
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
			if (data.user.length || data.pass.length) {
				data.auth = {
					user: data.user,
					pass: data.pass
				};
				// remove user and pass from data
				delete data.user;
				delete data.pass;
			} else {
				data.auth = false;
			}
			// Set blank branch to master
			data.branch = (data.branch === "") ? "master" : data.branch;
			// Send to API
			if (data.id === "new-project") {
				// Create new (PUT)
				req = requests.put("/api/project/", {
					dir: data.name,
					repo: data.repo,
					branch: data.branch || "master",
					auth: data.auth
				});

				req.done(function () {
					dom.showSuccess("Project successfully created");
					// Update ID field
					dom.$main.find("input[name=\"id\"]").val(data.name);
				});

				req.fail(function () {
					dom.showError("Project could not be created");
				});
			} else {
				// Modify object
				req = requests.post("/api/project/" + data.id, data);

				req.done(function () {
					dom.showSuccess("Project successfully saved");
				});

				req.fail(function () {
					dom.showError("Project could not be saved");
				});
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
