requirejs.config({
    paths: {
        'text': 'vendor/requirejs-text/text',
        'durandal':'vendor/durandal',
        'plugins' : 'vendor/durandal/plugins',
        'transitions' : 'vendor/durandal/transitions',
        'knockout': 'vendor/knockout/knockout-2.3.0',
        'jquery': 'vendor/jquery/jquery',
				'handlebars': 'vendor/handlebars/handlebars.min',
				'ansi_up': 'vendor/ansi_up/ansi_up',
				'github': 'vendor/github/github',
				'base64': 'vendor/base64/base64',
				'async': 'vendor/async/async',
				'underscore': 'vendor/underscore/underscore-min'
    },
    shim: {
				'handlebars': {
					'exports': 'Handlebars'
				}
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator'],  function (system, app, viewLocator) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'CodeSwarm Durandal!';

    app.configurePlugins({
        router: true
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
