var configuration = require("./configuration.js"),
	async = require("async"),
	fs = require("fs"),
	fse = require("fs-extra"),
	sendMail = require("./send-mail.js"),
	git = require("gift"),
	readline = require("readline"),
	spawn = require("child_process").spawn,
	ansi_up = require("ansi_up"),
	render,
	builder,
	trace,
	runProcess,
	failEmail;

// Get failEmail
failEmail = fs.readFileSync(__dirname + "/templates/failure.html");

/**
 * Simple mustache template renderer #################################
 */
render = function (template, data) {
	var templateRender = function (i, match) {
		return data[match];
	};

	return template.toString().replace(/\{\{([^}]+)\}\}/g, templateRender);
};

/**
 * Trace build output ################################################
 */

trace = function (build, data) {
	fs.appendFileSync(build.state.log, data + "\n");

	// Emit to socket
	io.sockets.emit("build", {
		project: build.dir,
		id: build.state.id,
		status: build.state.status,
		log: data + "\n"
	});
};

/**
 * Run Process #######################################################
 */

runProcess = function (build, process, callback) {
	// Trace start of process
	trace(build, "Running " + process);

	// Get arguments, split command, setup vars
	var args = process.split(" "),
		command = args[0],
		stdout,
		stderr,
		proc;

	// Set arguments by shifting array
	args.shift();

	// Check command to apply appropriate color flags
	switch (command) {
	case "npm":
		proc = spawn(command, [args, "--color", "always"], {
			cwd: config.app.builds + build.dir
		});
		break;
	case "grunt":
		if (args.length) {
			proc = spawn(command, [args, "--color"], {
				cwd: config.app.builds + build.dir
			});
		} else {
			proc = spawn(command, ["--color"], {
				cwd: config.app.builds + build.dir
			});
		}
		break;
	default:
		if (args.length) {
			proc = spawn(command, [args], {
				cwd: config.app.builds + build.dir
			});
		} else {
			proc = spawn(command, [], {
				cwd: config.app.builds + build.dir
			});
		}
	}

	// Set readLine listeners
	stdout = readline.createInterface({
		input: proc.stdout,
		terminal: false
	});
	stderr = readline.createInterface({
		input: proc.stderr,
		terminal: false
	});

	// Listen for stdout
	stdout.on("line", function (line) {
		trace(build, ansi_up.ansi_to_html(line));
	});

	// Listen for stderr
	stderr.on("line", function (line) {
		trace(build, ansi_up.ansi_to_html(line));
	});

	// Check status on close
	proc.on("close", function (code) {
		if (code === 0) {
			// Success
			callback(null);
		} else {
			// Failure
			callback("Process failed with code [" + code + "]");
		}
	});
};

/**
 * Deploy Builder ####################################################
 */

builder = function (build) {

	var logCommit;

	async.series({
		// Create log file
		log: function (callback) {
			fse.createFile(build.state.log, callback);
		},
		// Remove existing build
		cleanup: function (callback) {
			trace(build, "Preparing Build Environment");
			fse.remove(config.app.builds + build.dir, callback);
		},
		// Clone contents of repo
		clone: function (callback) {
			trace(build, "Cloning Repo");
			git.clone(build.repo, config.app.builds + build.dir, function (err, repo) {
				if (err) {
					callback(err);
				} else {
					// Pushes commit object into build state and traces info into log
					logCommit = function (build, commit) {
						build.state.commit = commit;
						trace(build, "├ Commit:   " + commit.id);
						trace(build, "├ Message:  " + commit.message.replace(/\n\n/g, "\n│           "));
						trace(build, "└ Author:   " + commit.committer.name + " &lt;" + commit.committer.email + "&gt;");
					};

					// if there is a branch configuration
					if (build.hasOwnProperty("branch") && build.branch) {
						// checkout the branch
						trace(build, "Checkout branch " + build.branch);
						repo.checkout(build.branch, function (err) {
							if (err) {
								callback(err);
							} else {
								repo.commits(build.branch, 1, function (err, commits) {
									if (err) {
										callback(err);
									} else {
										logCommit(build, commits[0]);
										callback(null);
									}
								});
							}
						});
					} else {
						repo.commits(build.branch, 1, function (err, commits) {
							if (err) {
								callback(err);
							} else {
								logCommit(build, commits[0]);
								callback(null);
							}
						});
					}
				}
			});
		},
		// Get config from repo, load into build.config
		config: function (callback) {
			trace(build, "Getting Config");
			fs.readFile(config.app.builds + build.dir + "/.vouch.json", function (err, config) {
				if (err) {
					callback(err);
				} else {
					build.state.config = JSON.parse(config);
					callback(null);
				}
			});
		},
		// Run tasks in build.config.run
		run: function (callback) {
			// Ensure run commands available
			if (build.state.config.hasOwnProperty("run")) {
				// Start series
				async.eachSeries(build.state.config.run, function (i, callback) {
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
		var log,
			subscribers;
		if (err) {
			// Set build status
			build.state.status = "fail";
			trace(build, err);
			trace(build, "BUILD FAILED");
			// Send failure email notifcation(s)
			if (build.state.hasOwnProperty("config")) {
				log = fs.readFileSync(build.state.log);
				// Send notification
				if (build.state.config.hasOwnProperty("notify") && build.state.config.notify.length) {
					subscribers = build.state.config.notify;
					sendMail({
						from: "VouchCD Builder <" + config.app.mailer.auth.user + ">",
						to: subscribers.join(),
						subject: "[BUILD FAILURE] " + build.state.name,
						html: render(failEmail, {
							build: build.state.name,
							log: log
						})
					});
				}
			}
			// Set build status in logs index
			fs.appendFileSync(config.app.logs + build.dir + "/index", "\n" + build.state.id + "-" + build.state.status);
			config.projects[build.dir] = build;
			configuration.set(config);
		} else {
			// Set build status
			build.state.status = "pass";
			trace(build, "BUILD COMPLETE");
			// Set build status in logs index
			fs.appendFileSync(config.app.logs + build.dir + "/index", "\n" + build.state.id + "-" + build.state.status);
			config.projects[build.dir] = build;
			configuration.set(config);
		}
	});

};

module.exports = builder;
