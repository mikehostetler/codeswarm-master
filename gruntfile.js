module.exports = function ( grunt ) {
    var TESTS = {
        base: "test/",
        coverage: 90
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        /**
         * Unit Tests
         */
        mocha: {
            all: [TESTS.base + "**/*.html"],
            options: {
                run: false
            }
        },

        /**
         * Code coverage and unit tests
         */
        blanket_mocha: {
            all: [TESTS.base + "**/*.html"],
            options: {
                threshold: TESTS.coverage,
                run: false
            }
        },

        /**
         * JSBeautifier
         */
        jsbeautifier: {
            ui: {
                src: ["ui/src/js/**/*.js", "!ui/src/js/vendor/**/*.js"],
                options: {
                    config: ".jsbeautifyrc",
                    js: {
                        fileTypes: [".js"]
                    },
                    html: {
                        fileTypes: [".tpl"]
                    }
                }
            },
            server: {
                src: ["index.js", "lib/**/*.js"],
                options: {
                    config: ".jsbeautifyrc"
                }
            }
        },

        /**
         * JSHint
         */
        jshint: {
            ui: {
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
         * RequireJS
         */
        requirejs: {
            main: {
                options: {
                    name: "main",
                    baseUrl: "ui/src/js",
                    mainConfigFile: "ui/src/js/main.js",
                    out: "ui/dist/js/main.js",
                    logLevel: 2
                }
            }
        },

        /**
         * Copy files into dist from src
         */
        copy: {
            main: {
                files: [
                    // Vendor files (libraries)
                    { expand: true, cwd: "ui/src/js/vendor/", src: [ "**" ], dest: "ui/dist/js/vendor/" },
                    // CSS files
                    { expand: true, cwd: "ui/src/css/", src: [ "**" ], dest: "ui/dist/css/" },
                    // Fonts
                    { expand: true, cwd: "ui/src/fonts/", src: [ "**" ], dest: "ui/dist/fonts/" },
                    // Index
                    { expand: true, cwd: "ui/src/", src: [ "index.html", "favicon.ico" ], dest: "ui/dist/" }
                ]
            }
        },

        /**
         * Minify CSS file
         */
        cssmin: {
            minify: {
                expand: true,
                cwd: "ui/src/css/",
                src: ["*.css"],
                dest: "ui/dist/css/",
                ext: ".css"
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
                }
            },
            css: {
                files: [ "ui/src/css/*.css" ],
                tasks: [ "cssmin:minify" ],
                options: { nospawn: true }
            }
        }
    });

    // Load NPM Tasks
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-blanket-mocha");

    // Register Tasks
    // Test
    grunt.registerTask("test", "Beautify js files and run mocha unit tests and blanket code coverage." , ["jsbeautifier", "jshint", "blanket_mocha"]);
    // Default 
    grunt.registerTask("default", "Build project for production.",  ["jsbeautifier", "jshint", "blanket_mocha", "requirejs", "copy", "cssmin"]);

};
