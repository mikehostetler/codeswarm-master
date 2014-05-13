/* global requirejs:true */
require.config({
	baseUrl: 'js',
	paths: {
    'controllers': 'controllers',
		'models': 'models',
		'utils': 'utils',

		// Customized DurandalJS
		'durandal.src': 'vendor/durandal/js',
		'durandal': 'ext/durandal.extension',

		'plugins': 'vendor/durandal/js/plugins',
		'transitions': 'vendor/durandal/js/transitions',

		// Customized Amplify
		'amplify.src': 'vendor/amplify/lib/amplify.min',
		'amplify': 'ext/amplify.extension',

		'ansi_up': 'vendor/ansi_up/ansi_up',
		'async': 'vendor/async/lib/async',
		'backbone': 'vendor/backbone/backbone',
		'base64': 'vendor/base64/base64.min',
		'github': 'vendor/github/github',
		'gravatar': 'vendor/gravatarjs/gravatar',
		'handlebars': 'vendor/handlebars/handlebars.min',
		'jquery': 'vendor/jquery/dist/jquery.min',
		
		// Use Knockout at commit SHA 224f8e94095dd9ba7dd5623391f7a9220f704f45
		// You must build it manually for this to work
		'knockout': 'ext/knockout-latest.debug',
		'ko.validate': 'vendor/knockout-validation/Src/knockout.validation',
		'postal': 'vendor/postal.js/lib/postal.min',

		// Use Sails.js version of Socket.io
		'socketio': 'sails.io.js',
		'text': 'vendor/requirejs-text/text',
		'underscore': 'vendor/underscore/underscore'
	},
	shim: {
		'amplify': {
			deps: ['jquery'],
			'exports': 'amplify'
		},
		'backbone': {
			deps: ['jquery','underscore'],
			'exports': 'Backbone'
		},
		'handlebars': {
			'exports': 'Handlebars'
		},
		'socketio': {
			exports: 'io'
		},
		'underscore': {
			exports: '_'
		}
	}
});

