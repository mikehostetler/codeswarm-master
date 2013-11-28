var async = require("async"),
    fs = require("fs"),
    fse = require("fs-extra"),
    git = require("gift"),
    nodemailer = require("nodemailer"),
    spawn = require("child_process").spawn;
    
// Trace and log build data
var trace = function (build, data) {
    fs.appendFileSync(build.log, data + "\n");
    console.log(data);
    // Check for failure
    if (build.status == "fail") {
        notify(build);
    }
};

// Notify subscribers on failure
var notify = function (build) {
    var subscribers = build.config.notify,
    transport = nodemailer.createTransport("SMTP", config.app.mailer),
    log = fs.readFileSync(build.log),
    pre_style = "style=\"display: block; max-height: 500px; overflow: scroll; background: #ccc; padding: 15px;\"",
    mailOptions = {
        from: "VouchCD Builder <"+config.app.mailer.auth.user+">",
        to: subscribers.join(),
        subject: "[BUILD FAILURE] " + build.name,
        html: "<strong>ATTENTION:</strong><br>\
              The deployment of " + build.name + " has failed!<hr>\
              <pre "+pre_style+"><code>" + log + "</code></pre>"
    };
    
    // Send notifation email
    transport.sendMail(mailOptions, function(error, response){
        if (error) {
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
        transport.close();
    });
};

// Run a process (spawn)
var runProcess = function (build, process, callback) {
    trace(build, "Running " + process);
    
    // Get arguments, split command, setup vars
    var args = process.split(" "),
        command = args[0],
        proc,
        output = [];
    
    // Set arguments by shifting array
    args.shift();

    // Spawn command and push output to array
    if (args.length) {
        proc = spawn(command, [args], { cwd: config.app.builds+build.dir });
    } else {
        proc = spawn(command, [], { cwd: config.app.builds+build.dir });
    }
    
    // Record standard output
    proc.stdout.on("data", function (data) {
        trace(build, data.toString());
    });
    
    // Record error output
    proc.stderr.on("data", function (data) {
        trace(build, data.toString());
    });
        
    // Check status on close
    proc.on("close", function (code, signal) {
        if (code===0) {
            // Success
            callback(null);
        } else {
            // Failure
            callback("Process failed.");
        }
    });
};

// Builder function
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
    }, function (err, result) {
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