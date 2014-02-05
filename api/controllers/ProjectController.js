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

var uuid     = require('../../lib/uuid');
var extend   = require('util')._extend;
var projects = require('../db/projects');
var builds   = require('../db/builds');
var Build    = require('../../lib/build');


var repoRegexp = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?\.git$/;

module.exports = {


  /**
   * Action blueprints:
   *    `POST /projects`
   */
   create: function (req, res) {

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
  },


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
  list: function (req, res) {
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
  },


  /**
   *     `POST /:owner/:repo/deploy`
   */
  deploy: function(req, res) {
    var projectName = req.param('owner') + '/' + req.param('repo');

    projects.get(projectName, gotProject);

    function gotProject(err, project) {
      if (! err && ! project) {
        err = new Error('Could not find project');
        err.status_code = 404;
      }

      if (err) return res.send(err.status_code || 500, err);

      var id = uuid();
      var time = Date.now();

      var build = {
        _id: id,
        project: project._id,
        created_at: time,
        triggered_by: req.session.username(),
        repo: project.repo,
        dir: id
      };

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

        build.branch = project.branch;

        // Set state object
        build.state = 'pending';

        builds.create(build, createdBuild);

      } else {
        res.json({});
      }
    }

    function createdBuild(err, build) {
      if (err) {
        res.send(err.status_code || 500, err);
      } else {
        // Run build
        Build(build, function(err) {
          if (err) res.send(err.status_code || 500, err);
          else res.json(build);
        });
      }
    }


  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ProjectController)
   */
  _config: {}


};
