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