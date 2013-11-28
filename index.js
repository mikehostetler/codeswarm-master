var fs = require("fs"),
    express = require("express"),
    app = express(),
    expressAuth = require("./lib/express-auth.js"),
    builder = require("./lib/builder.js");
    slashes = require("connect-slashes"),
    config = require("./config.json");
    
/**
 * Watch config for changes ##########################################
 */
 
fs.watchFile("./config.json", { persistent: true, interval: 500 }, function (curr, prev) {
    if (curr.mtime !== prev.mtime) {
        fs.readFile("./config.json", function (err, data) {
            if (err) throw err;
            config = JSON.parse(data);
        });
    }
});

/**
 * Build/Deploy Listener #############################################
 */

app.post("/:key/:project", function(req, res) {
    
    // Ensure the project has been config'd
    if (!config.builds.hasOwnProperty(req.params.project)) {
        // Nope, send an error
        res.send("ERROR: Configuration.");
    } else if (config.builds[req.params.project].key !== req.params.key) {
        // Incorrect build key
        res.send("ERROR: Build Key.");
    } else {
        // Set build
        var build = config.builds[req.params.project],
            stamp = new Date().getTime();
        // Set name
        build.name = req.params.project + ", Build " + stamp;
        // Set log
        build.log = config.app.logs + build.dir + "/" + stamp +".log";
        // Set status
        build.status = "Running";
        // Send deploy response
        res.send("DEPLOYING: Logfile: " + build.log.replace(__dirname, ""));
        // Run build
        builder(build);
    }   

});

/**
 * Static Server #####################################################
 */

// Fix trailing slashes (or lack there of)  
app.use(slashes());

// Get by project route 
app.get("/:project/*", expressAuth, function (req, res) {
    var project = req.params.project;
    if(!config.builds.hasOwnProperty(project)) {
        res.send("Missing configuration");
    } else {
        // Get .vouch.json from build
        fs.readFile(config.app.builds + config.builds[project].dir + "/.vouch.json", function (err, data) {
            if (err) {
                // Problem reading deploy config
                res.send(err);
            } else {
                var deploy = JSON.parse(data),
                    dir = config.app.builds + config.builds[project].dir + "/" + deploy.dir,
                    path = req.params[0] ? req.params[0] : deploy.default;
                // Send default file by... well, default.
                res.sendfile( path, { root: dir } );
            }    
        });
    }
});

/**
 * Start App #########################################################
 */

app.listen(config.app.port);
console.log("Service running over " + config.app.port);