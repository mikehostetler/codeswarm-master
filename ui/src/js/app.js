define([
	"controllers/dom",
	"controllers/session",
	"controllers/users",
	"controllers/router",
	"controllers/projects",
	"controllers/logs",
	"controllers/socket"
], function (dom, session, users, Router, projects, logs) {
	var app;

	app = {

		init: function () {
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

			// Logs list
			router.on("/:project/logs", function (project) {
				authenticated(function () {
					logs.showList(project);
					dom.setBodyClass("project-logs");
				});
			});

			// Log output
			router.on("/:project/logs/:log", function (project, log) {
				authenticated(function () {
					logs.showLog(project, log);
					dom.setBodyClass("view-log");
				});
			});

			router.on("/project/new", function() {
				authenticated(function () {
					projects.configProject();
				});
			});

			// Logout
			router.on("/logout", function () {
				session.unset();
				router.go("/");
			});

			router.on("/:owner/:repo", function(owner, repo) {
				authenticated(function () {
					projects.viewProject(owner + '/' + repo);
				});
			});

			router.on("/:owner/:repo/config", function(owner, repo) {
				authenticated(function () {
					projects.configProject(owner + '/' + repo);
				});
			});



			// Kick off process
			router.process();

		}

	};

	return app;

});
