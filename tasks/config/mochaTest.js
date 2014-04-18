/**
 * Test files with Mocha unit test
 *
 * ---------------------------------------------------------------
 *
 * This grunt task is configured to clean out the contents in the .tmp/public of your
 * sails project.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-clean
 */
module.exports = function(grunt) {

	/**
	 * Mocha Unit Tests (node.js)
	 */
	grunt.config.set('mochaTest', {
		test: {
			options: {
				mocha: require('mocha'),
				ui: 'bdd',
				reporter: 'dot',
				colors: true,
				clearRequireCache: true
			},
			src: ['test/**/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');
};

