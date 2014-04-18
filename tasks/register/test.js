module.exports = function(grunt) {
	grunt.registerTask('test', [
				'mocha', 
				'mochaTest',
				'blanket_mocha' 
			]);
};
