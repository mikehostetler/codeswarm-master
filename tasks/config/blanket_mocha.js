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
	 * Mocha Unit Tests (client-side JS)
	 */
	grunt.config.set('blanket_mocha', {
		all: [ 'test/**/*.html' ],
		options: {
			threshold: 100,
			run: true
		}
	});

	grunt.loadNpmTasks('grunt-blanket-mocha');
};

