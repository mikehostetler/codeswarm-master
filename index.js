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
