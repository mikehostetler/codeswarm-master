/* global config:true, io:true */
var configuration = require("./lib/configuration.js"),
	fs = require("fs"),
	express = require("express"),
	app = express(),
	expressAuth = require("./lib/express-auth.js"),
	builder = require("./lib/builder.js"),
	api = require("./lib/api.js"),
	//	slashes = require("connect-slashes"),
	socket_log = false,
	mode = "production",
	root;

/**
 * Default expressjs configuration
 */
// use logger
app.use(express.logger());
// compress response
app.use(express.compress());
// use bodyParser
app.use(express.json());
app.use(express.urlencoded());
// methodOverride middleware (PUT, DELETE)
app.use(express.methodOverride());

/**
 * handle 'dev' argument
 */
if (process.argv[2] && process.argv[2] === "dev") {
	// express setting for development environment
	socket_log = true;
	mode = "development";
	root = __dirname + "/ui/src";

	app.use(express.errorHandler({
		dumpException: true,
		showStack: true
	}));

} else {

	// express setting for production environment
	root = __dirname + "/ui/dist";
	app.use(express.errorHandler());
}

// fix trailing slashes (or lack thereof)
//app.use(slashes);

// Set global config
config = configuration.get();

/**
 * Watch config for changes ##########################################
 */

fs.watchFile("./config.json", {
	persistent: true,
	interval: 500
}, function (curr, prev) {
	if (curr.mtime !== prev.mtime) {
		config = configuration.get();
	}
});

/**
 * Build/Deploy Listener #############################################
 */

app.post("/deploy/:project", function (req, res) {
	// Get project
	var project = req.params.project;

	// Ensure the project has been config'd
	if (!config.projects.hasOwnProperty(project)) {
		// Nope, send an error
		res.send("ERROR: Configuration.");
	} else {
		// Set build
		var build = config.projects[project],
			stamp = new Date().getTime(),
			post = req.body,
			run = false,
			payload, ref, branch;

		// Check trigger condition and branch match
		if (!post.hasOwnProperty("payload")) {
			// Manual trigger
			run = true;
		} else {
			payload = JSON.parse(post.payload);
			// Check to ensure branch match
			if (payload.hasOwnProperty("ref")) {
				//console.log(post);
				ref = payload.ref.split("/");
				branch = ref[ref.length - 1];
				if (branch === build.branch) {
					run = true;
				}
			}
		}

		if (run) {

			// Set state object
			build.state = {};
			// Set ID
			build.state.id = stamp;
			// Set current working directory
			build.state.cwd = stamp;
			// Set name
			build.state.name = project + ", Build " + stamp;
			// Set log
			build.state.log = config.app.logs + build.dir + "/" + stamp + ".log";
			// Set status
			build.state.status = "processing";
			// Send deploy response
			res.send({
				build: build.state.id
			});
			// Run build
			builder(build);

		}
	}

});

/**
 * API ##############################################################
 */

app.get("/api/:type/*", function (req, res) {
	api.get(req, res);
});

app.post("/api/:type/*", function (req, res) {
	api.post(req, res);
});

app.put("/api/:type", function (req, res) {
	api.put(req, res);
});

app.del("/api/:type/*", function (req, res) {
	api.del(req, res);
});

/**
 * Static Server #####################################################
 */
app.get("/*", function (req, res) {
	var path = req.params[0] ? req.params[0] : "index.html";
	res.sendfile(path, {
		root: root
	});
});
// Get by project route
app.get("/view/:project/*", expressAuth, function (req, res) {
	var project = req.params.project;
	if (!config.projects.hasOwnProperty(project)) {
		res.send(404);
	} else {
		// Check if build is running
		if (config.projects[project].hasOwnProperty("state") && config.projects[project].state.status === "processing") {
			// Build is processing
			res.send("<html><head><meta http-equiv=\"refresh\" content=\"5\"></head><body>Build processing, please wait...</body></html>");
		} else {
			// Get .vouch.json from build
			fs.readFile(config.app.builds + config.projects[project].dir + "/.vouch.json", function (err, data) {
				if (err) {
					// Problem reading deploy config
					res.send("Missing deploy script.");
				} else {
					// Check that build status is passing
					if (config.projects[project].hasOwnProperty("state") && config.projects[project].state.status === "pass") {
						var deploy = JSON.parse(data),
							dir = config.app.builds + config.projects[project].dir + "/" + deploy.dir,
							path = req.params[0] ? req.params[0] : deploy.
						default;
						// Send default file by... well, default.
						res.sendfile(path, {
							root: dir
						});
					} else {
						res.send("Build failed.");
					}
				}
			});
		}
	}
});

/**
 * Sockets ###########################################################
 */

io = require("socket.io").listen(app.listen(config.app.port), {
	log: socket_log
});
io.sockets.on("connection", function (socket) {
	socket.emit("system", {
		message: "Socket connection established"
	});
});

/**
 * Start Msg #########################################################
 */

console.log("Vouch Service running over " + config.app.port + " in " + mode + " mode from " + root);
