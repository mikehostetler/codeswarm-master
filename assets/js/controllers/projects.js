define([
	"controllers/dom",
	"controllers/requests",
	"controllers/session",
	"controllers/router",
	"controllers/timestamp",
	"controllers/error",
	"controllers/socket",
	"controllers/users",
	"github",
	"async"
], function (dom, requests, session, Router, timestamp, error, socket, users, Github, async) {
	var router,
		projects;

	router = new Router();

	projects = {

		showList: function () {

			var self = this,
				req = requests.get("/projects"),
				acl_data = {};

			req.done(function (projects) {
				var proj;
				// Check for state and format timestamp

				projects.forEach(prepareProject);
				dom.loadProjects(projects, self);
			});

			req.fail(error.handleXhrError);
		},

		search: function (terms, cb) {
			requests.
			  get('/projects?search=' + encodeURIComponent(terms)).
			  done(function(projects) {
			  	projects.forEach(prepareProject);
			  	cb(projects);
			  }).
			  fail(error.handleXhrError);
		},

		runBuild: function (project) {
			var req = requests.post(project + '/deploy');

			req.done(function (build) {
				dom.showSuccess("Starting build...");
			});

			req.fail(error.handleXhrError);

		},

		viewProject: function (project) {

			var self = this,
				loadProject,
				data,
				hook = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");

			var req;
			if (project !== "new") {

				req = requests.get("/projects/" + project);

				req.done(function (project) {
					if (project.secret)
					  project.hook = hook + '/' + project._id + '/webhook?secret=' + project.secret;

					// Load project
					dom.loadProject(project, self);
				});

				req.fail(error.handleXhrError);

			} else {
				dom.loadProject({}, self);
			}
		},

		newProject: function() {

			var self = this;

			async.series([
				requestGithubToken,
				getAvailableRepos
				], done);

			var githubToken;

			function requestGithubToken(cb) {
				requests.get('/tokens/github').
					done(function(creds) {
						token = creds.token;
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
					user.repos('admin', cb);
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
					showRepos(repos, users.getCurrent());
				}
			}

			function showRepos(repos, user) {
				dom.listGithubRepos(repos, user, addRepo, removeRepo, directAdd);
			}

			function addRepo(repo) {
				dom.loadProject({
					repo: repo.github.git_url, isOwner: true }, self);
			}

			function removeRepo(repo) {
				router.go('/' + repo);
			}

			function directAdd() {
				dom.loadProject({ isOwner: true }, self);
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

			// Set auth object
			// Set blank branch to master
			if (!data.branch) data.branch = 'master';

			// Send to API
			if (!data._id) {

				requests.post("/projects", {
					repo: data.repo,
					branch: data.branch || "master",
					public: !! data.public,
					type: data.type
				}).
				done(function () {
					dom.showSuccess("Project successfully created");
					router.go('/projects');
				}).
				fail(error.handleXhrError);

			} else {
				// Modify object
				requests.put("/projects/" + data._id, data).
				done(function () {
					dom.showSuccess("Project successfully saved");
				}).
				fail(error.handleXhrError);
			}
		},

		deleteProject: function (name) {
			var req = requests.delete("/projects/" + name);

			req.done(function () {
				router.go("/projects");
				dom.showSuccess("Project successfully deleted");
			});

			req.fail(error.handleXhrError);
		},

		configPlugins: function (name) {
			var project, pluginsConfig;
			async.series([
				loadProject,
				loadPlugins
			], done);

			function loadProject(cb) {
				requests.get("/projects/" + name).
				done(function(_project) {
					project = _project;
					if (! project.type) dom.showError('Project has no defined type');
					else cb();
				}).
				fail(error.handleXhrError);
			}

			function loadPlugins(cb) {
				requests.get('/plugins/config/' + project.type).
				done(function(_pluginsConfig) {
					pluginsConfig = _pluginsConfig;
					cb();
				}).
				fail(error.handleXhrError);
			}

			function done() {
				dom.loadPluginConfig(project, pluginsConfig, save);
			}

			function save(config) {
				requests.put('/projects/' + project._id + '/plugins', config).
				done(function() {
					dom.showSuccess('Plugin settings saved');
				}).
				fail(error.handleXhrError);
			}

		}

	};

	return projects;

	/// Misc

	function sortGithubRepos(a, b) {
		return a.full_name < b.full_name ? -1 : 1;
	}

	function prepareProject(project) {
		var base_href = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
		project.view = base_href + "/#/" + project._id;
		if (project.started_at) project.started_at = timestamp(project.started_at);
		if (project.ended_at) project.ended_at = timestamp(project.ended_at);
		socket.addProject(project);
	}
});
