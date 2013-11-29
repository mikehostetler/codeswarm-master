module.exports = function ( grunt ) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        /**
         * RequireJS
         */
        requirejs: {
            main: {
                options: {
                    name: "main",
                    baseUrl: "ui/src/js",
                    mainConfigFile: "ui/src/js/main.js",
                    out: "ui/dist/js/main.js",
                    // include: ...
                    logLevel: 2
                }
            }
        },
        /**
         * JSHint
         */
        jshint: {
            dev: {
                options: {
                    jshintrc: ".jshintrc",
                    jshintignore: ".jshintignore"
                },
                files: {
                    src: ["ui/src/js/**/*.js"]
                }
            },
            server: {
                options: {
                    jshintrc: ".jshintrc",
                    jshintignore: ".jshintignore"
                },
                files: {
                    src: ["index.js", "lib/**/*.js"]
                }
            }
        },
        /**
         * Watch
         */
        watch: {
          scripts: {
            files: ["ui/src/js/**/*.js"],
            tasks: ["jshint"],
            options: {
               spawn: false
            },
          },
        }
    });
    
    // Load NPM Tasks
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    // Register Tasks
    grunt.registerTask("default", ["requirejs", "jshint"]);
    
};