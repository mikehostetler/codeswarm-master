var fs = require("fs"),
    express = require("express"),
    app = express(),
    builder = require("./lib/builder.js");
    slashes = require("./lib/connect-slashes.js"),
    git = require("gift"),
    config = require("./config.json");
    
/**
 * Watch config for changes
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
 * Build/Deploy listener
 */

app.post("/:key/:project", function(req, res) {
    
    // Ensure the project has been config'd
    if (!config.builds.hasOwnProperty(req.params.project)) {
        // Nope, send an error
        res.send("Failed to deploy. Missing or incorrect configuration.");
    } else if (config.builds[req.params.project].key !== req.params.key) {
        // Incorrect build key
        res.send("Failed to deploy. Incorrect or missing build key.");
    } else {
        
        // Set build
        var build = config.builds[req.params.project];
        // Create log
        build.log = config.app.logs + build.dir + "/" + new Date().getTime()+".log";
        // Send deploy response
        res.send("Deploying. Logfile: " + build.log.replace(__dirname, ""));
        // Run build
        builder(build);
    }   

});

/**
 * Static server
 */
 
// Setup basic authentication
var basicAuth = express.basicAuth,
    auth = function(req, res, next) {
        if (config.builds.hasOwnProperty(req.params.project)) {
            var auth = config.builds[req.params.project].auth;
            if (auth) {
                basicAuth(function(user, pass, callback) {
                    // Check credentials
                    callback(null, user === auth.user && pass === auth.pass);
                })(req, res, next);
            } else {
                // No authentication
                next();
            }
        }
    };

// Fix trailing slashes (or lack there of)  
app.use(slashes());

// Get by project route 
app.get("/:project/*", auth, function (req, res) {
    if(!config.builds.hasOwnProperty(req.params.project)) {
        res.send("Missing configuration");
    } else {
        // Get .vouch.json from build
        fs.readFile(config.app.builds + config.builds[req.params.project].dir + "/.vouch.json", function (err, data) {
            if (err) {
                // Problem reading deploy config
                res.send(err);
            } else {
                var deploy = JSON.parse(data),
                    dir = config.app.builds + config.builds[req.params.project].dir + "/" + deploy.dir,
                    path = req.params[0] ? req.params[0] : deploy.default;
                // Send default file by... well, default.
                res.sendfile( path, { root: dir } );
            }    
        });
    }
});

app.listen(config.app.port);
console.log("Service running over " + config.app.port);
