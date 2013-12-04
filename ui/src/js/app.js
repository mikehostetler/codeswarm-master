define([
	"controllers/dom",
	"controllers/session",
	"controllers/router",
	"controllers/projects",
	"controllers/logs"
], function (dom, session, Router, projects, logs) {

	var app = {

		init: function () {
			// Start DOM controller
			dom.init();

			// Routing
			var router = new Router();

			// Home
			router.on("/", function () {
				if (!session.get()) {
					dom.loadLogin();
					session.getLogin();
				} else {
					router.go("/projects");
				}
			});

			// Projects list
			router.on("/projects", function () {
				if (!session.get()) {
					router.go("/");
				} else {
					dom.loadApp();
					projects.showList();
				}
			});

			// Logs list
			router.on("/logs/:project", function (project) {
				if (!session.get()) {
					router.go("/");
				} else {
					dom.loadApp();
					logs.showList(project);
				}
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
