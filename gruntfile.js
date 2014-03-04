module.exports = function (grunt) {

  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';

  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadNpmTasks('grunt-contrib-compass');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      dev: {
        files: [
          {
          expand: true,
          cwd: './assets',
          src: ['**/*.!(coffee)'],
          dest: '.tmp/public'
        }
        ]
      },
      build: {
        files: [
          {
          expand: true,
          cwd: '.tmp/public',
          src: ['**/*'],
          dest: 'assets'
        }
        ]
      }
    },

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
      assets: {
        // When assets are changed:
        tasks: ['copy:dev']
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
    'copy:dev',
    'watch'
  ]);

};
