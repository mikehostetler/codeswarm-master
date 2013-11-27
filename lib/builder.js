var async = require("async"),
    fs = require("fs"),
    fse = require("fs-extra"),
    git = require("gift"),
    spawn = require("child_process").spawn;
    
// Log build data
var log = function (build, data, br) {
    br = (br === undefined) ? "\n" : " ";
    fs.appendFileSync(build.log, br + data);
    console.log(data);
};

// Builder function
var builder = function (build) {
    
    async.series({
        // Create log file
        log: function (callback) {
            fse.createFile(build.log, callback);
        },
        cleanup: function (callback) {
            log(build, "Cleanup");
            fse.remove(config.app.builds+build.dir, callback);
        },
        clone: function (callback) {
            log(build, "[PASS]", false);
            log(build, "Cloning Repo");
            git.clone(build.repo, config.app.builds+build.dir, callback);
        },
        config: function (callback) {
            log(build, "[PASS]", false);
            log(build, "Getting Config");
            fs.readFile(config.app.builds+build.dir+"/.vouch.json", function (err, config) {
                build.config = JSON.parse(config);
                callback(err);
            });
        },
        run: function (callback) {

            log(build, "[PASS]", false);
            // Ensure run commands available
            if (build.config.hasOwnProperty("run")) {
                
                async.eachSeries(build.config.run, function(i, callback) {
                    
                    log(build, "Running " + i);
                    
                    var args = i.split(" "),
                        command = args[0],
                        proc,
                        output = [];

                    args.shift();
                
                    // Spawn command and push output to array
                    if (args.length) {
                        proc = spawn(command, [args], { cwd: config.app.builds+build.dir });
                    } else {
                        proc = spawn(command, [], { cwd: config.app.builds+build.dir });
                    }
                    
                    // Record standard output
                    proc.stdout.on("data", function (data) {
                        output.push(data);
                    });
                    
                    // Record error output
                    proc.stderr.on("data", function (data) {
                        output.push(data);
                    });
                        
                    // Check status on close
                    proc.on("close", function (code, signal) {
                        if (code===0) {
                            // Success
                            log(build, Buffer.concat(output).toString());
                            log(build, "[PASS]", false);
                            callback(null);
                        } else {
                            // Failure
                            callback(Buffer.concat(output).toString());
                        }
                    });
                }, function (err) {
                    callback(err);
                });
                
            } else {
                callback(null);
            }
        }
    }, function (err, result) {
        if (err) {
            log(build, "[FAIL] \n" + err, false);
        } else {
            log(build, "BUILD COMPLETE");
        }
    });
    
};

module.exports = builder;