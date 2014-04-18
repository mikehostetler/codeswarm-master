require.config({
	baseUrl: 'js',
	paths: {
		'jquery': 'vendor/jquery/jquery.min',
		'text': 'vendor/requirejs-text/text',
		'handlebars': 'vendor/handlebars/handlebars.min',
		'knockout': 'vendor/knockout/knockout-3.1.0',
		'durandal': 'vendor/durandal/js',
		'plugins': 'vendor/durandal/js/plugins',
		'ansi_up': 'vendor/ansi_up/ansi_up',
		'github': 'vendor/github/github',
		'base64': 'vendor/base64/base64',
		'async': 'vendor/async/async',
		'underscore': 'vendor/underscore/underscore',
        'controllers': 'controllers',
        'routes': 'routes'
	},
	shim: {
		'handlebars': {
			'exports': 'Handlebars'
		}
	}
});

define(['durandal/system', 'durandal/app', 'plugins/router', 'controllers/session', 'controllers/socket', 'controllers/dom'], function (system, app, router, session, socket, dom) {

    app.configurePlugins({
        router: true
    });

    app.start().then(
        function () {

            var routings;

            system.debug(true);

            socket.reset();

            dom.init();

            routings = {
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

            routings.activate();
        });

    app.go2 = function (fragment) {
        router.navigate(fragment);
    };

    window.addEventListener('hashchange', function () {
        router.compositionComplete();
    }, false);
});
