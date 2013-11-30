/**
 * Controls all API methods ##########################################
 */

var api = {};

/**
 * Responds to GET requests
 */

api.get = function (req, res) {
    switch (req.params.type) {
    // Process token submission
    case "token":
        var token = req.params[0];
        if (config.app.tokens.indexOf(token) >= 0) {
            res.send(200, { session: new Date().getTime() });
        } else {
            res.send(404, "Bad Token");
        }
        break;
    }
};

/**
 * Responds to POST requests
 */

api.post = function (req, res) {
    res.send("POST!");
};

/**
 * Responds to PUT requests
 */

api.put = function (req, res) {
    res.send("PUT");
};

/**
 * Responds to DELETE requests
 */

api.del = function (req, res) {
    res.send("DELETE");
};


// Export
module.exports = api;