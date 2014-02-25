requirejs.config({
    paths: {
        'text': 'vendor/requirejs-text/text',
        'durandal':'vendor/durandal',
        'plugins' : 'vendor/durandal/plugins',
        'knockout': 'vendor/knockout/knockout-2.3.0',
        'jquery': 'vendor/jquery/jquery',
				'ansi_up': 'vendor/ansi_up/ansi_up',
				'github': 'vendor/github/github',
				'underscore': 'vendor/underscore/underscore-min',
				'session':	'controllers/session',
				'users':		'controllers/users',
				'projects':	'controllers/projects',
				'builds':	'controllers/builds',
				'socket':	'controllers/socket',
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'socket'],  function (system, app, viewLocator,socket) {

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

		socket.reset();

    app.title = 'Welcome to CodeSwarm!';

    app.configurePlugins({
        router: true,
				widget: true
    });

    app.start().then(function() {
			//Replace 'viewmodels' in the moduleId with 'views' to locate the view.
			//Look for partial views in a 'views' folder in the root.
			viewLocator.useConvention();

			//Show the app by setting the root view model for our application with a transition.
			//app.setRoot('viewmodels/shell', 'entrance');
			app.setRoot('codeswarm/app');
    });
});
