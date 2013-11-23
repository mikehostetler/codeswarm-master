var fs = require("fs"),
    fse = require("fs-extra"),
    step = require("step"),
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
        var build = config[req.params.project];
        
        build.log = log_path + build.dir + "/" + new Date().getTime()+".log";
        
        res.send("Deploying. Logfile: " + build.log.replace(__dirname, ""));
        
        step(
            // Create log
            function makeLog () {
                fse.createFile(build.log, this);
            },
            // Cleanup
            function cleanup (err) {
                log(build.log, "Running Cleanup");
                fse.remove(build_path+build.dir, this);
            },
            // Clone
            function clone (err) {
                log(build.log, "Cloning");
                if (err) {
                    log(build.log, "ERROR: cleanup");
                }
                git.clone(build.repo, build_path+build.dir, this);
            },
            // Ensure .deploy available
            function config (err) {
                log(build.log, "Loading deploy config");
                if (err) {
                    log(build.log, "ERROR: clone");
                } else {
                    fs.readFile(build_path+build.dir+"/.deploy.json", this);
                }
            },
            // Install
            function install (err, config) {
                log(build.log, "Installing");
                if (err) {
                    log(build.log, "ERROR: config");
                }
                // Set build config from .deploy.json
                build.config = JSON.parse(config);
                // Run npm install
                exec("npm install", { cwd: build_path+build.dir }, this);
            },
            // Grunt
            function grunt () {
                log(build.log, "Grunting");
                if (arguments[0] !== null) {
                    log(build.log, "ERROR: install");
                } else {
                    exec("grunt", { cwd: build_path+build.dir }, this);
                }
            },
            // Complete
            function complete () {
                if (arguments[0] !== null) {
                    log(build.log, "ERROR: grunt");
                } else {
                    log(build.log, "Built!");
                }
            }
            
        );
    }

});

var log = function (logfile, data) {
    fs.appendFileSync(logfile, data + "\n");
};


app.listen(1337);
console.log("Serving app over 1337");

/**
 * Static server
 */

builds.use(express.static(__dirname + '/builds'));
builds.listen(8080);
console.log("Serving builds over 8080");