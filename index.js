var express = require("express"),
    app = express(),
    builds = express(),
    config = require("./config.json");

/**
 * Deploy listener
 */

app.get("/:project", function(req, res){
    
    // Ensure the project has been config'd
    if (!config.hasOwnProperty(req.params.project)) {
        // Nope, send an error
        res.send("Failed to deploy. Missing or incorrect configuration");
    } else {
        // Good to go
        res.send("Deploying!");
        
        var spawn = require('child_process').spawn;
        spawn(__dirname + "/runner.sh \"" + __dirname + "/builds/" + req.params.project + "\"", [], { stdio: "inherit" });
    }

});

app.listen(1337);
console.log("Serving app over 1337");

/**
 * Static server
 */

builds.use(express.static(__dirname + '/builds'));
builds.listen(8080);
console.log("Serving builds over 8080");