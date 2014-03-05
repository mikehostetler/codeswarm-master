module.exports = function (grunt) {

  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';

  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');

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

    jsbeautifier: {
      dev: {
      src: ['assets/js/**/*.js', '!assets/js/vendor/**/*.js', '!assets/js/socket.io.js'],
      options: {
        config: '.jsbeautifyrc'
      }
      }
    },

    jshint: {
      dev: {
      options: {
        jshintrc: '.jshintrc',
        jshintignore: '.jshintignore'
      },
        files: {
          src: ['assets/js/**/*.js']
        }
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
    'jshint',
    'copy:dev',
    'watch'
  ]);

  // When Sails is lifted in prod:
  grunt.registerTask('prod', [
    'compass',
    'copy:build'
  ]);

};
