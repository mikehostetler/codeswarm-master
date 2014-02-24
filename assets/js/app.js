define([
	"controllers/dom",
	"controllers/session",
	"controllers/users",
	"controllers/router",
	"controllers/projects",
	"controllers/builds",
	"controllers/socket"
], function (dom, session, users, Router, projects, builds, socket) {
	var app;

	app = {

		init: function () {

			socket.reset();

			var router,
				authenticated;
			// Start DOM controller
			dom.init();

			// Routing
			router = new Router();

			var lastAuthenticatedBackendCheck;
			// Ensures authentication on routed tasks
			function authenticated(fn) {
				if (!session.get()) {
					// Not logged in? Save state, Go home.
					localStorage.setItem("route", window.location.hash.replace("#", ""));
					router.go("/");
				} else {
					if (needsSessionRecheck()) {
						session.check(function(err, sid) {
							if (err) dom.showError(err.message);
							else {
								lastAuthenticatedBackendCheck = Date.now();
								dom.loadApp();
								fn.call();
							}
						});
					} else if (typeof fn === "function") {
						dom.loadApp();
						fn.call();
					}
				}
			};

			var maxRecheckCacheMs = 1000 * 60;

			function needsSessionRecheck() {
				return (!lastAuthenticatedBackendCheck ||
					Date.now() - lastAuthenticatedBackendCheck > maxRecheckCacheMs);
			}

			// Home
			router.on("/", function () {
				projects.showList();
				dom.setBodyClass("home-page");
			});

			// About - Static HTML page
			router.on("/about", function () {
				dom.loadPage('about');
				dom.setBodyClass("about-page");
			});

			// Support - Static HTML page
			router.on("/support", function () {
				dom.loadPage('support');
				dom.setBodyClass("support-page");
			});

			// Contribute - Static HTML page
			router.on("/contribute", function () {
				dom.loadPage('contribute');
				dom.setBodyClass("contribute-page");
			});

			// Login page
			router.on("/login", function () {
				if (!session.get()) {
					dom.loadLogin();
					dom.setBodyClass("login");
					session.getLogin();
				} else {
					router.go("/");
				}
			});

			// Forgot Password
			router.on("/forgot-password", function () {
				if (!session.get()) {
					dom.loadForgotPassword();
					dom.setBodyClass("forgot-password");
				} else {
					router.go("/");
				}
			});

			// Logout
			router.on("/logout", function () {
				session.unset();
				router.go("/");
			});


			// Projects list - TODO change this
			router.on("/projects", function () {
				authenticated(function () {
					projects.showList();
					dom.setBodyClass("project-list");
				});
			});

			// Project default (builds list)
			router.on("/:owner/:repo", function (owner, repo) {
				var project = owner + '/' + repo;
				authenticated(function () {
					builds.list(project);
					projects.viewProject(project);
					dom.loadBuilds();
					dom.setBodyClass("builds--builds");
				});
			});

			// Builds
			router.on("/:owner/:repo/builds", function (owner, repo) {
				var project = owner + '/' + repo;
				authenticated(function () {
					dom.loadBuilds();
					dom.setBodyClass("builds--builds");
				});
			});

			// Pull Requests
			router.on("/:owner/:repo/pull-requests", function (owner, repo) {
				var project = owner + '/' + repo;
				authenticated(function () {
					dom.loadPullRequests();
					dom.setBodyClass("builds--pull-requests");
				});
			});

			// Branches
			router.on("/:owner/:repo/branches", function (owner, repo) {
				var project = owner + '/' + repo;
				authenticated(function () {
					dom.loadBranches();
					dom.setBodyClass("builds--branches");
				});
			});

			router.on("/:owner/:repo/config", function(owner, repo) {
				console.log('CONFIG', arguments);
				authenticated(function () {
					dom.loadProjectConfig();
					dom.setBodyClass("project--config");
					//projects.configProject(owner + '/' + repo);
				});
			});

			// Build output (default build logs)
			router.on("/:owner/:repo/builds/:log", function (owner, repo, log) {
				var project = owner + '/' + repo;
				authenticated(function () {
					builds.show(project, log);
					dom.setBodyClass("build--build");
				});
			});

			// Build
			router.on("/:owner/:repo/build/:log", function (owner, repo, log) {
				var project = owner + '/' + repo;
				authenticated(function () {
					dom.loadBuild();
					dom.setBodyClass("build--build");
				});
			});

			// Analysis
			router.on("/:owner/:repo/analysis/:log", function (owner, repo, log) {
				var project = owner + '/' + repo;
				authenticated(function () {
					dom.loadAnalysis();
					dom.setBodyClass("build--analysis");
				});
			});

			// Source
			router.on("/:owner/:repo/source/:log", function (owner, repo, log) {
				var project = owner + '/' + repo;
				authenticated(function () {
					dom.loadSource();
					dom.setBodyClass("build--source");
				});
			});

			router.on("/project/new", function() {
				authenticated(function () {
					projects.newProject();
				});
			});

			// Home
			router.on("/users/new", function () {
				dom.loadSignup();
				dom.setBodyClass("signup");
				users.getSignup();
			});

			// User profile
			router.on("/mike", function () {
				dom.loadUserProfile();
				dom.setBodyClass("user");
			});

			// User settings
			router.on("/mike/settings", function () {
				dom.loadUserSettings();
				dom.setBodyClass("user--setings");
			});

			router.beforeChange = function() {
				socket.reset();
			};


			// Kick off process
			router.process();

		}

	};

	return app;

});
