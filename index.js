var express = require("express"),
    app = express(),
    builds = express(),
    spawn = require('child_process').spawn,
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
        
        var command = spawn(__dirname + "/runner.sh", [__dirname + "/builds/" + req.params.project.dir], {
            cwd: __dirname + "/builds/" + req.params.project.dir    
        });
        var output  = [];
        
        command.stdout.on('data', function (chunk) {
            output.push(chunk);
        }); 
        
        command.on('close', function(code) {
            if (code === 0) {
                res.send("Deployed");
                console.log(Buffer.concat(output).toString());
            } else {
                res.send("Error");
                console.log("ERROR " + code + " " + Buffer.concat(output).toString());
            }
        });
            
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