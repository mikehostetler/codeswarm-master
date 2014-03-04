module.exports = function (grunt) {

  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';

  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');

  grunt.loadNpmTasks('grunt-contrib-compass');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    compass: {
      main: {
        options: {
          sassDir: './assets/sass',
          cssDir: './assets/styles',
          outputStyle: 'compressed',
          require: 'breakpoint'
        }
      }
    },

    watch: {
      api: {
        files: ['api/**/*']
      },
      css: {
        files: [ './assets/sass/*.scss', './assets/sass/*/*.scss' ],
        tasks: [ 'compass:main' ],
        options: { nospawn: true }
      }
    }
  });

  // When Sails is lifted:
  grunt.registerTask('default', [
    'compass',
    'watch'
  ]);

};
