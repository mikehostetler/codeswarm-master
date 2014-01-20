define([
	"controllers/dom",
	"controllers/session",
	"controllers/router",
	"controllers/projects",
	"controllers/logs",
	"controllers/socket"
], function (dom, session, Router, projects, logs) {
	var app;

	app = {

		init: function () {
			var router,
				checkedRun;
			// Start DOM controller
			dom.init();

			// Routing
			router = new Router();
			// Ensures authentication on routed tasks
			checkedRun = function (fn) {
				if (!session.get()) {
					// Not logged in? Save state, Go home.
					localStorage.setItem("route", window.location.hash.replace("#", ""));
					router.go("/");
				} else {
					if (typeof fn === "function") {
						dom.loadApp();
						fn.call();
					}
				}
			};

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

			// Projects list
			router.on("/projects", function () {
				checkedRun(function () {
					projects.showList();
					dom.setBodyClass("project-list");
				});
			});

			// Logs list
			router.on("/logs/:project", function (project) {
				checkedRun(function () {
					logs.showList(project);
					dom.setBodyClass("project-logs");
				});
			});

			// Log output
			router.on("/logs/:project/:log", function (project, log) {
				checkedRun(function () {
					logs.showLog(project, log);
					dom.setBodyClass("view-log");
				});
			});

			// Show Project
			router.on("/project/:project", function (project) {
				checkedRun(function () {
					// Ensure administrative login
					session.getACL(function (acl) {
						if (acl.projects === "all") {
							projects.showProject(project);
							dom.setBodyClass("view-project");
						} else {
							router.go("/");
						}
					});
				});
			});

			// Logout
			router.on("/logout", function () {
				session.unset();
				router.go("/");
			});

			// Kick off process
			router.process();

		}

	};

	return app;

});
