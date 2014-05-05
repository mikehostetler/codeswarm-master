require(['require-config'], function () {
  require([
    'durandal/system',
    'durandal/app',
    'durandal/viewLocator'
  ], function (system, app, viewLocator) {

    // Set debug
    system.debug(true);

    // Application title
    app.title = 'Welcome to CodeSwarm!';

    // Plugins
    app.configurePlugins({
      router: true,
      widget: true,
      dialog: true
    });

    app.start().then(function () {
      // Define viewLocator convention
      viewLocator.useConvention('controllers', 'views');
      // Set app root
      app.setRoot('controllers/app');
    });
  });
});
