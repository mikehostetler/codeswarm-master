/* global requirejs:true */
requirejs.config({
  paths: {
    'text': 'vendor/requirejs-text/text',
    'durandal': 'vendor/durandal',
    'plugins': 'vendor/durandal/plugins',
    'transitions': 'vendor/durandal/transitions',
    'knockout': 'vendor/knockout/knockout-2.3.0',
    'jquery': 'vendor/jquery/jquery',
    'socketio': 'socket.io.js',
    'ansi_up': 'vendor/ansi_up/ansi_up',
    'github': 'vendor/github/github',
    'underscore': 'vendor/underscore/underscore-min',
    'request': 'utils/request',
    'dom': 'utils/dom',
    'session': 'utils/session'
  },
  shim: {
    'socketio': {
      exports: 'io'
    }
  }
});

define([
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
    widget: true
  });

  app.start().then(function () {
    // Define viewLocator convention
    viewLocator.useConvention('controllers', 'views');
    // Set app root
    app.setRoot('controllers/app');
  });
});
