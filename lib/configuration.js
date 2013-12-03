var fs = require("fs");

var configuration = {

    get: function () {
        return JSON.parse(fs.readFileSync("config.json"));
    },

    set: function (data) {
        fs.writeFileSync("config.json", JSON.stringify(data, null, 4));
    }

};

module.exports = configuration;
