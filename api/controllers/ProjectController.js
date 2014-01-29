/**
 * ProjectController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var extend   = require('util')._extend;
var projects = require('../db/projects');
var builder  = require('../../lib/builder');


var repoRegexp = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?\.git$/;

module.exports = {


  /**
   * Action blueprints:
   *    `POST /projects`
   */
   create: ['isAuthenticated', function (req, res) {

    var project = extend({}, req.body);
    var match = project.repo.match(repoRegexp);
    var id = match[5];
    project._id = id;
    project.owners = [ req.session.username() ];
    projects.create(project, replied);

    function replied(err, reply) {
      if (err) res.send(err.status_code || 500, err);
      else res.json(reply);
    }
  }],


  /**
   *    `GET /:owner/:repo`
   */
  find: function (req, res) {

    var id = req.param('owner') + '/' + req.param('repo');
    var user = req.session.username();

    projects.get(id, replied);

    function replied(err, project) {
      if (err) res.send(err.status_code || 500, err);
      else if (! project) res.send(404, new Error('Not found'));
      else {
        if (project.public || user && project.owners.indexOf(user) >= 0)
          res.send(project);
        else res.send(404, new Error('Not Found'));
      }
    }

    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },


  /**
   *    `GET /projects`
   */
  list: ['isAuthenticated', function (req, res) {
    var user = req.session.username();
    if (user) {
      projects.listFor(user, replied);
    } else {
      res.send(403, new Error('You need to be logged in for now'));
    }

    function replied(err, projects) {
      if (err) res.send(err.status_code || 500, err);
      else res.send(projects);
    }
  }],


  /**
   *     `POST /:owner/:repo/deploy`
   */
  deploy: ['isAuthenticated', function(req, res) {
    var project = req.param('owner') + '/' + req.param('repo');

    // Set build
    var build = project;
    var stamp = new Date().getTime();
    var post = req.body;
    var run = false;
    var payload, ref, branch;

    // Check trigger condition and branch match
    if (!post.hasOwnProperty("payload")) {
      // Manual trigger
      run = true;
    } else {
      payload = JSON.parse(post.payload);
      // Check to ensure branch match
      if (payload.hasOwnProperty("ref")) {
        //console.log(post);
        ref = payload.ref.split("/");
        branch = ref[ref.length - 1];
        run = branch === project.branch;
      }
    }

    if (run) {

      // Set state object
      build.state = {
        // Set ID
        id:     stamp,
        // Set current working directory
        cwd:    stamp,
        // Set log URL
        logURL: req.protocol + "://" + req.get("host") + "/#/logs/" + build.dir + "/" + stamp,
        // Set name
        name:   project + ", Build " + stamp,
        // Set log
        //log:    config.app.logs + build.dir + "/" + stamp + ".log",
        // Set status
        status: "processing"

      };

      console.log('build:', build);

      // Send deploy response
      res.send({
        build: stamp
      });
      // Run build
      builder(build);
    }
  }],




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ProjectController)
   */
  _config: {}


};
