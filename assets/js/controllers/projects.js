define([
	"controllers/dom",
	"controllers/requests",
	"controllers/session",
	"controllers/router",
	"controllers/timestamp",
	"controllers/error"
], function (dom, requests, session, Router, timestamp, error) {
	var router,
		projects;

	router = new Router();

	projects = {

		showList: function () {

			var self = this,
				req = requests.get("/projects"),
				acl_data = {},
				base_href = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");

			req.done(function (projects) {
				var proj;
				// Check for state and format timestamp

				projects.forEach(function(project) {
					if (project.state) {
						project.state.timestamp = timestamp(data[proj].state.id);
					}
					project.view = base_href + "/#/" + project._id;
				});
				dom.loadProjects(projects, self);
			});

			req.fail(error.handleXhrError);
		},

		runBuild: function (project) {
			console.log('RUNNING BUILD for PROJECT', project);
			var req = requests.post(project + '/deploy');

			req.done(function (build) {
				console.log('DONE! build:', build);
				dom.showSuccess("Starting build...");
				// Pause to allow build to start, then redirect
				setTimeout(function () {
					router.go('/' + project + '/builds/' + build._id);
				}, 2000);
			});

			req.fail(function () {
				dom.showError("Could not start build");
			});

		},

		viewProject: function (project) {

			var self = this,
				loadProject,
				data,
				hook = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");

			var req;
			if (project !== "new") {

				req = requests.get("/projects/" + project);

				req.done(function (data) {
					data.hook = hook + "/deploy/" + data.dir;
					// Load project
					dom.loadProject(data, self);
				});

				req.fail(error.handleXhrError);

			} else {
				dom.loadProject({}, self);
			}
		},

		configProject: function (project) {

			var self = this,
				loadProject,
				data,
				hook = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");

			var req;
			if (project !== "new") {

				req = requests.get("/projects/" + project);

				req.done(function (data) {
					data.hook = hook + '/' + data._id + '/deploy';
					// Load project
					dom.loadProject(data, self);
				});

				req.fail(error.handleXhrError);

			} else {
				dom.loadProject({}, self);
			}
		},

		saveProject: function (data) {
			var req;
			// Set auth object
			// Set blank branch to master
			data.branch = (data.branch === "") ? "master" : data.branch;
			// Send to API
			if (!data._id) {

				req = requests.post("/projects", {
					repo: data.repo,
					branch: data.branch || "master"
				});

				req.done(function () {
					dom.showSuccess("Project successfully created");
					// Update ID field
					dom.$main.find("input[name=\"_id\"]").val(data.name);
				});

				req.fail(error.handleXhrError);
			} else {
				// Modify object
				req = requests.post("/projects/" + data._id, data);

				req.done(function () {
					dom.showSuccess("Project successfully saved");
				});

				req.fail(error.handleXhrError);
			}
		},

		deleteProject: function (name) {
			var req = requests.delete("/projects/" + name);

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
