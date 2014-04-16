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
	grunt.config.set('mocha', {
		all: ['src/public/test/**/*.html'],
		options: {
			run: true
		}
	});

	grunt.loadNpmTasks('grunt-mocha');
};

