/* global requirejs:true */
require.config({
	baseUrl: 'js',
	paths: {
		'text': 'vendor/requirejs-text/text',
		'durandal': 'vendor/durandal/js',
		'plugins': 'vendor/durandal/js/plugins',
		'transitions': 'vendor/durandal/js/transitions',
		'knockout': 'vendor/knockout/knockout-3.1.0',
		'jquery': 'vendor/jquery/jquery.min',
		'socketio': 'sails.io.js',
		'ansi_up': 'vendor/ansi_up/ansi_up',
		'async': 'vendor/async/async',
		'github': 'vendor/github/github',
		'underscore': 'vendor/underscore/underscore',
		'gravatar': 'vendor/gravatar/gravatar',
		'base64': 'vendor/base64/base64',
		'jqcustomselect': 'vendor/jquery.customselect/jquery.customselect.min',
		'handlebars': 'vendor/handlebars/handlebars.min',
		'amplify': 'vendor/amplify/amplify.min',
		'request': 'utils/request',
		'utils': 'utils',
    'controllers': 'controllers',
    'routes': 'routes'
	},
	shim: {
		'handlebars': {
			'exports': 'Handlebars'
		},
		'socketio': {
			exports: 'io'
		},
		'underscore': {
			exports: '_'
		},
		'jqcustomselect': {
			exports: 'jqcustomselect'
		}
	}
});

