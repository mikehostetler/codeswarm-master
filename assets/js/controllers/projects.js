define([
	"controllers/dom",
	"controllers/requests",
	"controllers/session",
	"controllers/router",
	"controllers/timestamp",
	"controllers/error",
	"controllers/socket",
	"github",
	"async"
], function (dom, requests, session, Router, timestamp, error, socket, Github, async) {
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
					project.view = base_href + "/#/" + project._id;
					if (project.started_at) project.started_at = timestamp(project.started_at);
					if (project.ended_at) project.ended_at = timestamp(project.ended_at);
					socket.addProject(project);
				});
				dom.loadProjects(projects, self);
			});

			req.fail(error.handleXhrError);
		},

		runBuild: function (project) {
			var req = requests.post(project + '/deploy');

			req.done(function (build) {
				dom.showSuccess("Starting build...");
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

		newProject: function() {

			async.series([
				requestGithubToken,
				getAvailableRepos
				], done);

			var githubToken;

			function requestGithubToken(cb) {
				requests.get('/tokens/github').
					done(function(_token) {
						token = _token;
						cb();
					}).
					fail(error.xhrToCallback(cb));
			}

			function getAvailableRepos(cb) {
				async.parallel({
					githubRepos: getGithubRepos,
					userRepos: getUserRepos
				}, gotRepos);

				function getGithubRepos(cb) {
					var github = new Github({
						token: token,
						auth: 'oauth'
					});
					var user = github.getUser();
					user.repos(cb);
				}

				function getUserRepos(cb) {
					requests.get('/projects').
					  done(function(repos) {
					  	cb(null, repos);
					  }).
					  fail(error.xhrToCallback(cb));
				}

				function gotRepos(err, results) {
					if (results) {
						var githubRepos = results.githubRepos;
						var userRepos = results.userRepos;
					}

					if (githubRepos)
						githubRepos.sort(sortGithubRepos);

					if (githubRepos && userRepos) {
						var userReposMap = {};
						userRepos.forEach(function(userRepo) {
							userReposMap[userRepo._id] = userRepo;
						});

						var repos = githubRepos.map(function(githubRepo) {
							var repoId = githubRepo.full_name;
							var userRepo = userReposMap[repoId];
							return {
								github: githubRepo,
								userRepo: userRepo,
								userHasRepo: !! userRepo
							}
						});
					}

					cb(err, repos);
				}
			}

			function done(err, results) {
				var repos = results[1];
				if (err) {
					if (err.status == 404) dom.requestGithubToken();
					else dom.showError(err.message);
				} else if (! repos) {
					dom.showError('Could not retrieve repos');
				} else {
					showRepos(repos);
				}
			}

			function showRepos(repos) {
				dom.listGithubRepos(repos);
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

	/// Misc

	function sortGithubRepos(a, b) {
		return a.full_name < b.full_name ? -1 : 1;
	}
});
