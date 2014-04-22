require(['require-config'], function() {
	require([
		'durandal/system', 
		'durandal/app', 
		'durandal/viewLocator', 
		'plugins/router', 
		'utils/session', 
		'utils/socket', 
		'utils/dom'
	], function (system, app, viewLocator, router, session, socket, dom) {

		system.debug(true);

		app.title = 'Welcome to CodeSwarm!';

    app.configurePlugins({
        router: true
    });

    app.start().then(function () {
				//var routing;
				//socket.reset();
				//dom.init();

			/*
				routing = {
					router: router,
					activate: function () {
						router.map([
							{ route: '', title: 'Home', moduleId: 'routes/login_route', nav: true },
							{ route: 'projects', title: 'Projects', moduleId: 'routes/projects_route', nav: true },
							{ route: ':owner/:repo', title: 'Repo', moduleId: 'routes/repo_route', nav: true },
							{ route: ':owner/:repo/config', title: 'Repo', moduleId: 'routes/repo_config_route', nav: true },
							{ route: ':owner/:repo/plugins', title: 'Repo', moduleId: 'routes/repo_plugins_route', nav: true },
							{ route: ':owner/:repo/builds', title: 'Repo', moduleId: 'routes/repo_builds_route', nav: true },
							{ route: ':owner/:repo/builds/:log', title: 'Repo', moduleId: 'routes/repo_log_route', nav: true },
							{ route: 'project/new', title: 'Repo', moduleId: 'routes/new_project_route', nav: true },
							{ route: 'logout', title: 'Repo', moduleId: 'routes/logout_route', nav: true },
							{ route: 'users/new', title: 'Repo', moduleId: 'routes/new_user_route', nav: true },
						]).buildNavigationModel();
		 
						return router.activate();
					}
				};

				routing.activate();
				*/

				// Define viewLocator convention
				viewLocator.useConvention('controllers', 'views');

				app.setRoot('controllers/app');
		});

    app.go2 = function (fragment) {
        router.navigate(fragment);
    };

    window.addEventListener('hashchange', function () {
        router.compositionComplete();
    }, false);
	});
});
