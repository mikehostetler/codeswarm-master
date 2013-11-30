/**
 * Controls all API methods ##########################################
 */

var api = {};

/**
 * Responds to GET requests
 */

api.get = function (req, res) {
    res.send(req.params.type + " " + req.params[0]);
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