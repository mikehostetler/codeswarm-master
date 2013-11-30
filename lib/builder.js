var async = require("async"),
    fs = require("fs"),
    fse = require("fs-extra"),
    sendMail = require("./send-mail.js"),
    git = require("gift"),
    readline = require("readline"),
    spawn = require("child_process").spawn;
    
/**
 * Trace build output ################################################
 */

var trace = function (build, data) {
    fs.appendFileSync(build.log, data + "\n");
    console.log(data);
    
    // On build fail, send notification
    if (build.status === "fail") {
        var subscribers = build.config.notify,
            log = fs.readFileSync(build.log),
            preStyle = "style=\"display: block; max-height: 500px; overflow: scroll; background: #ccc; padding: 15px;\"";
        // Send notification
        if (build.config.notify.length) {
            sendMail({
                from: "VouchCD Builder <"+config.app.mailer.auth.user+">",
                to: subscribers.join(),
                subject: "[BUILD FAILURE] " + build.name,
                html: "<strong>ATTENTION:</strong><br>\
                      The deployment of " + build.name + " has failed!<hr>\
                      <pre "+preStyle+"><code>" + log + "</code></pre>"
            });
        }
        // Set build status in index
        fs.appendFileSync(config.app.logs + build.dir + "/index", "\n"+build.id+"-"+build.status);
    } else if (build.status === "pass") {
        // Set build status in index
        fs.appendFileSync(config.app.logs + build.dir + "/index", "\n"+build.id+"-"+build.status);
    }
};

/**
 * Run Process #######################################################
 */

var runProcess = function (build, process, callback) {
    // Trace start of process
    trace(build, "Running " + process);
    
    // Get arguments, split command, setup vars
    var args = process.split(" "),
        command = args[0],
        proc;
    
    // Set arguments by shifting array
    args.shift();

    // Spawn command and push output to array
    if (args.length) {
        // Run with arguments
        proc = spawn(command, [args], { cwd: config.app.builds+build.dir });
    } else {
        // Run simple command (no args)
        proc = spawn(command, [], { cwd: config.app.builds+build.dir });
    }
    
    // Set readLine listeners
    var stdout = readline.createInterface({
            input: proc.stdout,
            terminal: false
        }),
        stderr = readline.createInterface({
            input: proc.stderr,
            terminal: false
        });
    
    // Listen for stdout
    stdout.on("line", function(line) {
        trace(build, line);
    });
    
    // Listen for stderr
    stderr.on("line", function(line) {
        trace(build, line);
    });
        
    // Check status on close
    proc.on("close", function (code) {
        if (code===0) {
            // Success
            callback(null);
        } else {
            // Failure
            callback("Process failed.");
        }
    });
};

/**
 * Deploy Builder ####################################################
 */

var builder = function (build) {
    
    async.series({
        // Create log file
        log: function (callback) {
            fse.createFile(build.log, callback);
        },
        // Remove existing build
        cleanup: function (callback) {
            trace(build, "Cleanup");
            fse.remove(config.app.builds+build.dir, callback);
        },
        // Clone contents of repo
        clone: function (callback) {
            trace(build, "Cloning Repo");
            git.clone(build.repo, config.app.builds+build.dir, callback);
        },
        // Get config from repo, load into build.config
        config: function (callback) {
            trace(build, "Getting Config");
            fs.readFile(config.app.builds+build.dir+"/.vouch.json", function (err, config) {
                build.config = JSON.parse(config);
                callback(err);
            });
        },
        // Run tasks in build.config.run
        run: function (callback) {
            // Ensure run commands available
            if (build.config.hasOwnProperty("run")) {
                // Start series
                async.eachSeries(build.config.run, function(i, callback) {
                    runProcess(build, i, callback);
                }, function (err) {
                    callback(err);
                });
            } else {
                // No run commands, callback null
                callback(null);
            }
        }
    }, function (err) {
        if (err) {
            // Set build status
            build.status = "fail";
            trace(build, err);
        } else {
            // Set build status
            build.status = "pass";
            trace(build, "BUILD COMPLETE");
        }
    });
    
};

module.exports = builder;