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
				'request': 'utils/request',
				'dom': 'utils/dom'
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator' ],  function (system, app, viewLocator) {

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

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
