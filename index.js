var fs = require("fs"),
    fse = require("fs-extra"),
    async = require("async"),
    express = require("express"),
    app = express(),
    builds = express(),
    exec = require("child_process").exec,
    git = require("gift"),
    config = require("./config.json"),
    build_path = __dirname + "/builds/",
    log_path = __dirname + "/logs/";

/**
 * Deploy listener
 */

app.get("/:project", function(req, res) {
    
    // Ensure the project has been config'd
    if (!config.hasOwnProperty(req.params.project)) {
        // Nope, send an error
        res.send("Failed to deploy. Missing or incorrect configuration");
    } else {
        
        // Set build
        var build = config[req.params.project],
            step;
        
        build.log = log_path + build.dir + "/" + new Date().getTime()+".log";
        
        res.send("Deploying. Logfile: " + build.log.replace(__dirname, ""));
        
        async.series({
            // Create log file
            log: function (callback) {
                fse.createFile(build.log, callback);
            },
            cleanup: function (callback) {
                log(build, "Cleanup");
                fse.remove(build_path+build.dir, callback);
            },
            clone: function (callback) {
                log(build, " [PASS]", false);
                log(build, "Cloning Repo");
                git.clone(build.repo, build_path+build.dir, callback);
            },
            config: function (callback) {
                log(build, " [PASS]", false);
                log(build, "Getting Config");
                fs.readFile(build_path+build.dir+"/.deploy.json", function (err, config) {
                    build.config = JSON.parse(config);
                    callback(err);
                });
            },
            install: function (callback) {
                log(build, " [PASS]", false);
                if (build.config.install) {
                    log(build, "Running npm install");
                    exec("npm install", { cwd: build_path+build.dir }, callback);
                } else {
                    callback(null);
                }
            },
            grunt: function (callback) {
                if (build.config.install) {
                    log(build, " [PASS]", false);
                }
                
                if (build.config.grunt) {
                    log(build, "Running Grunt");
                    exec("grunt " + build.config.grunt, { cwd: build_path+build.dir }, callback);
                } else {
                    callback(null);
                }
            }
        }, function (err, result) {
            if (err) {
                log(build, "[FAIL] " + err, false);
            } else {
                if (build.config.grunt) {
                    log(build, " [PASS]", false);
                }
                log(build, "BUILD COMPLETE");
            }
        });
    }

});

var log = function (build, data, br) {
    br = (br === undefined) ? "\n" : " ";
    fs.appendFileSync(build.log, br + data);
    console.log(data);
};


app.listen(1337);
console.log("Serving app over 1337");

/**
 * Static server
 */

builds.use(express.static(__dirname + '/builds'));
builds.listen(8080);
console.log("Serving builds over 8080");