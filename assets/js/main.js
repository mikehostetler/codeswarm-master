require.config({
	baseUrl: "js",
	paths: {
		"jquery": "vendor/jquery/jquery.min",
		"text": "vendor/requirejs-text/text",
		"handlebars": "vendor/handlebars/handlebars.min",
		"ansi_up": "vendor/ansi_up/ansi_up",
		"github": "vendor/github/github",
		"app": "app"
	},
	shim: {
		"handlebars": {
			"exports": "Handlebars"
		}
	}
});

define(["app"], function (app) {

	//Start the application
	app.init();

});
