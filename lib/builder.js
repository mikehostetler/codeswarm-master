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
        console.log(config.app.mailer);
    }
};

// Notify subscribers on failure
var notify = function (build) {
    var subscribers = build.config.notify,
    transport = nodemailer.createTransport("SMTP", config.app.mailer),
    log = fs.readFileSync(build.log),
    pre_style = "style=\"display: block; height: 500px; overflow: scroll; background: #ccc; padding: 15px;\"",
    mailOptions = {
        from: config.app.mailer.auth.user,
        to: subscibers.join(),
        subject: "[BUILD FAILURE] " + build.name,
        html: "ATTENTION:<br>\
              The deployment of " + build.name + " has failed!<br>\
              ----------------------------------------------------\
              <pre "+pre_style+"><code>" + log + "</code></pre>"
    };
    
    // Send notifation email
    transport.sendMail(mailOptions, function(error, response){
        if (error) {
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
        smtpTransport.close();
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
                
                async.eachSeries(build.config.run, function(i, callback) {
                    
                    trace(build, "Running " + i);
                    
                    // Get arguments, split command, setup vars
                    var args = i.split(" "),
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
                            trace(build, Buffer.concat(output).toString());
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