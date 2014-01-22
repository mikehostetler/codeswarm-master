
/// Middleware

var expressAuth = require("./lib/express-auth.js");
var sessionMW   = require('./lib/session');
var requireUser = require('./lib/require_user');


/// Controllers

var users    = require('./controllers/users');
var sessions = require('./controllers/sessions');
var projects = require('./controllers/projects');


module.exports = routes;

function routes(app, root) {

  /**
   * Build/Deploy Listener #############################################
   */

  app.post("/:owner/:repo/deploy", projects.deploy);


  /**
   * Status icons
   */
  app.get("/statusicon/*", function (req, res) {
    var project = req.params[0].replace(".png", ""),
      statusicon;
    if (!config.projects.hasOwnProperty(project)) {
      res.send(404, "Project not found");
    } else {
      if (!config.projects[project].hasOwnProperty("state") || config.projects[project].state.status === "processing") {
        statusicon = fs.readFileSync(__dirname + "/lib/status_icons/build-pending.png");
      } else if (config.projects[project].state.status === "fail") {
        statusicon = fs.readFileSync(__dirname + "/lib/status_icons/build-failing.png");
      } else {
        statusicon = fs.readFileSync(__dirname + "/lib/status_icons/build-passing.png");
      }
      // Respond with image
      res.writeHead(200, {
        "Content-Type": "image/png"
      });
      res.end(statusicon, "binary");
    }
  });

  /**
   * API ##############################################################
   */

  /// Users

  app.post("/api/users", users.create.validate, users.create);


  /// Sessions

  app.post("/api/sessions", sessions.create.validate, sessions.create);

  app.get("/api/session", sessions.get);


  /// Projects

  app.post('/api/projects',
    sessionMW,
    requireUser,
    projects.create.validate,
    projects.create);

  app.get('/api/projects',
    sessionMW,
    projects.list);

  app.get('/api/projects/:owner/:repo',
    sessionMW,
    requireUser,
    projects.get);

  /// Others

  app.get("/api/:type/*", function (req, res) {
    api.get(req, res);
  });

  app.post("/api/:type/*", function (req, res) {
    api.post(req, res);
  });

  app.put("/api/:type", function (req, res) {
    api.put(req, res);
  });

  app.del("/api/:type/*", function (req, res) {
    api.del(req, res);
  });

  /**
   * Static Server #####################################################
   */

  app.get("/*", function (req, res) {
    var path = req.params[0] ? req.params[0] : "index.html";
    res.sendfile(path, {
      root: root
    });
  });

}