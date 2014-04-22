/**
 * Compiles Compass files into CSS.
 *
 * ---------------------------------------------------------------
 */
module.exports = function(grunt) {

	grunt.config.set('compass', {
		main: {
			options: {
				sassDir: './assets/styles',
				cssDir: './assets/styles',
				outputStyle: 'compressed',
				require: 'breakpoint'
			}
		},
		dev: {
			options: {
				sassDir: './assets/styles',
				cssDir: './assets/styles',
				outputStyle: 'expanded',
				require: 'breakpoint'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
};
