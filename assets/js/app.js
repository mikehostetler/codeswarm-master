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
				if (!session.get()) {
					dom.loadLogin();
					dom.setBodyClass("login");
					session.getLogin();
				} else {
					router.go("/projects");
				}
			});

			// Home
			router.on("/users/new", function () {
				dom.loadSignup();
				dom.setBodyClass("signup");
				users.getSignup();
			});

			// Projects list
			router.on("/projects", function () {
				authenticated(function () {
					projects.showList();
					dom.setBodyClass("project-list");
				});
			});

			router.on("/:owner/:repo", function(owner, repo) {
				console.log('REPO', arguments);
				var project = owner + '/' + repo;
				authenticated(function () {
					projects.viewProject(project);
				});
			});

			router.on("/:owner/:repo/config", function(owner, repo) {
				console.log('CONFIG', arguments);
				authenticated(function () {
					projects.configProject(owner + '/' + repo);
				});
			});

			// Build list
			router.on("/:owner/:repo/builds", function (owner, repo) {
				var project = owner + '/' + repo;
				authenticated(function () {
					builds.list(project);
					dom.setBodyClass("project-logs");
				});
			});

			// Log output
			router.on("/:owner/:repo/builds/:log", function (owner, repo, log) {
				var project = owner + '/' + repo;
				authenticated(function () {
					builds.show(project, log);
					dom.setBodyClass("view-log");
				});
			});

			router.on("/project/new", function() {
				authenticated(function () {
					projects.newProject();
				});
			});

			// Logout
			router.on("/logout", function () {
				session.unset();
				router.go("/");
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
