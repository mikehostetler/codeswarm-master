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
			// Ensures authentication on routed tasks
			function authenticated(fn) {
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
			router.on("/logs/:project", function (project) {
				authenticated(function () {
					logs.showList(project);
					dom.setBodyClass("project-logs");
				});
			});

			// Log output
			router.on("/logs/:project/:log", function (project, log) {
				authenticated(function () {
					logs.showLog(project, log);
					dom.setBodyClass("view-log");
				});
			});

			// Show Project
			router.on("/project/:project", function (project) {
				authenticated(function () {
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

			router.on("/project/new", function() {
				console.log('new project');
				authenticated(function () {
					dom.loadProject({}, projects);
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
