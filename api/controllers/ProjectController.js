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

var async    = require('async');
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

    console.log('req body saving project:', req.body);

    var project = extend({}, req.body);
    var match = project.repo.match(repoRegexp);
    if (! match) return res.send(409, new Error('Invalid repo URL'));

    var id = match[5];
    project._id = id;
    project.owners = [ req.session.username() ];
    project.public = !! project.public;

    projects.create(project, replied);

    function replied(err, reply) {
      if (err) res.send(err.status_code || 500, err);
      else res.json(reply);
    }
  },

  /**
   * Action blueprints:
   *    `PUT /projects/:owner/:repo`
   */
   update: function (req, res) {

    var id = req.param('owner') + '/' + req.param('repo');
    var project = extend({}, req.body);

    var match = project.repo.match(repoRegexp);
    if (! match) return res.send(409, new Error('Invalid repo URL'));

    var newId = match[5];

    if (newId != id) return res.send(409, new Error('Repo URL cannot change'));


    project.public = !! project.public;

    projects.update(id, project, replied);

    function replied(err, reply) {
      if (err) res.send(err.status_code || 500, err);
      else res.json({ok: true});
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

      if (! project.type) return res.send(500, new Error('no project type defined'));

      var id = uuid();
      var time = Date.now();

      var build = {
        _id: id,
        project: project._id,
        created_at: time,
        triggered_by: req.session.username(),
        repo: project.repo,
        dir: id,
        branch: project.branch,
        commit: 'HEAD',
        type: project.type
      };

      build.branch = project.branch;

      // Set state object
      build.state = 'pending';

      builds.create(build, createdBuild);
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


  // destroy

  destroy: function destroy(req, res) {
    var projectName = req.param('owner') + '/' + req.param('repo');

    async.series([
      getProject,
      validateAuthorization,
      deleteProject],
      reply);

    var project;

    function getProject(cb) {
      projects.get(projectName, gotProject);

      function gotProject(err, _project) {
        if (_project) project = _project;
        cb(err);
      }
    }

    function validateAuthorization(cb) {
      if (! project.owners)
        return res.forbidden('No project owners');
      if (project.owners.indexOf(req.session.username()) < 0)
        return res.forbidden('you are not an owner of ' + projectName);
      cb();
    }


    function deleteProject(cb) {
      projects.delete(project, cb);
    }

    function reply(err) {
      if (err) return res.send(err.status_code || 500, err);
      else return res.json({ok: true});
    }
  },


  webhook: function webhook(req, res) {
    if (! req.project) return res.send(404, new Error('No project found'));

    var project = req.project;
    var run = false;
    var payload, ref, branch;

    if (! project.type) return res.send(500, new Error('no project type defined'));

    payload = req.body;
    // Check to ensure branch match
    if (payload.hasOwnProperty("ref")) {
      ref = payload.ref.split("/");
      branch = ref[ref.length - 1];
      run = branch === project.branch;
    }

    if (run) {
      var id = uuid();

      var build = {
        _id: id,
        project: project._id,
        created_at: Date.now(),
        triggered_by: 'Github webhook',
        repo: project.repo,
        dir: id,
        branch: project.branch,
        state: 'pending',
        commit: payload.after,
        type: project.type
      };

      builds.create(build, createdBuild);
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
