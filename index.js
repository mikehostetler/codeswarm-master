var fs = require("fs"),
    fse = require("fs-extra"),
    step = require("step"),
    express = require("express"),
    app = express(),
    builds = express(),
    exec = require("child_process").exec,
    git = require("gift"),
    config = require("./config.json"),
    build_path = __dirname + "/builds/";

/**
 * Deploy listener
 */

app.get("/:project", function(req, res) {
    
    // Ensure the project has been config'd
    if (!config.hasOwnProperty(req.params.project)) {
        // Nope, send an error
        res.send("Failed to deploy. Missing or incorrect configuration");
    } else {
        
        res.send("Deploying...");
        
        // Set build
        var build = config[req.params.project];
        
        step(
            // Cleanup
            function cleanup () {
                console.log("Cleanup");
                fse.remove(build_path+build.dir, this);
            },
            // Clone
            function clone (err) {
                console.log("Cloning");
                if (err) {
                    console.log("ERROR: cleanup");
                }
                git.clone(build.repo, build_path+build.dir, this);
            },
            // Ensure .deploy available
            function config (err) {
				console.log("Loading deploy config");
				if (err) {
					console.log("ERROR: clone");
				} else {
					fs.readFile(build_path+build.dir+"/.deploy.json", this);
				}
            },
            // Install
            function install (err, config) {
                console.log("Installing");
                if (err) {
                    console.log("ERROR: config");
                }
                // Set build config from .deploy.json
                build.config = JSON.parse(config);
                // Run npm install
                exec("npm install", { cwd: build_path+build.dir }, this);
            },
            // Grunt
            function grunt () {
                console.log("Grunting");
                if (arguments[0] !== null) {
                    console.log("ERROR: install");
                } else {
                    exec("grunt", { cwd: build_path+build.dir }, this);
                }
            },
            // Complete
            function complete () {
                if (arguments[0] !== null) {
                    console.log("ERROR: grunt");
                } else {
                    console.log("Built!");
                }
            }
            
        );
    }

});


app.listen(1337);
console.log("Serving app over 1337");

/**
 * Static server
 */

builds.use(express.static(__dirname + '/builds'));
builds.listen(8080);
console.log("Serving builds over 8080");