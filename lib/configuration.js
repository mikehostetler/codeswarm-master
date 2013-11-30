var fs = require("fs");

var configuration = {
    
    get: function () {
        return JSON.parse(fs.readFileSync("config.json"));
    },
    
    set: function (data) {
        console.log("Save!");
    }
    
};

module.exports = configuration;