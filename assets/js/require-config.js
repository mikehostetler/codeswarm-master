/* global requirejs:true */
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

