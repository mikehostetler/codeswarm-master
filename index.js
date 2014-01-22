/* global config:true, io:true */
var configuration = require("./lib/configuration.js"),
	fs = require("fs"),
	express = require("express"),
	app = express(),
	redirect = require("express-redirect"),
	builder = require("./lib/builder.js"),
	api = require("./lib/api.js"),
	socket_log = false,
	mode = "production",
	root, onListen;


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

if (process.env.NODE_ENV !== "production") {
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

// Set global config
config = configuration.get();

// Mount redirect plugin
redirect(app);

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
			// Set log URL
			build.state.logURL = req.protocol + "://" + req.get("host") + "/#/logs/" + build.dir + "/" + stamp;
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


require('./routes')(app, root);

/**
 * Sockets ###########################################################
 */

io = require("socket.io").listen(app.listen(config.app.port, onListen), {
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

onListen = function () {
	console.log("Vouch Service running over " + config.app.port + " in " + mode + " mode from " + root);
};
