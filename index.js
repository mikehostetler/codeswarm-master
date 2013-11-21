var express = require("express"),
    app = express(),
    builds = express(),
    config = require("./config.json");

/**
 * Deploy listener
 */

app.get("/:project", function(req, res){
    
    // Ensure the project has been config'd
    if (!config.hasOwnProperty[req.param.project]) {
        // Nope, send an error
        res.send("Failed to deploy. Missing or incorrect configuration");
    } else {
        res.send("Deploying!");
    }

});

app.listen(1337);
console.log("Serving app over 1337");

/**
 * Static server
 */

builds.use(express.static(__dirname + '/builds'));
builds.listen(80);
console.log("Serving builds over 80");