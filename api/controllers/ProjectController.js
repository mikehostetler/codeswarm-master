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


var repoRegexp = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?\.git$/;

module.exports = {

  /**
   * Action blueprints:
   *    `POST /projects`
   */
   create: function (req, res) {

    Project.create(req.body, replied);

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

    Project.merge(id, req.body, saved);

    function saved(err, project) {
      if (err) res.send(err.status_code, err);
      else res.json(project);
    }
  },


  /**
   *    `GET /projects/:owner/:repo`
   */
  find: function (req, res) {

    var id = req.param('owner') + '/' + req.param('repo');

    Project.findOne({id: id}, replied);

    function replied(err, project) {
      if (err) res.send(err.status_code || 500, err);
      else if (! project) res.send(404, new Error('Not found'));
      else {
        var user = req.session.username();
        if (project.public || user && project.owners.indexOf(user) >= 0)
          res.send(filterProjectForUser(project, user));
        else res.send(404, new Error('Not Found'));
      }
    }
  },


  /**
   *    `GET /projects`
   */
  list: function (req, res) {
    var user = req.session.username();
    var search = req.param('search');

    if (! user) {
      res.send(403, new Error('You need to be logged in for now'));
    } else if (! search) {
      Project.findByOwners(user, replied);
    } else {
      Project.findByOwnersAndId([user, search], replied);
    }

    function replied(err, projects) {
      if (err) res.send(err.status_code || 500, err);
      else res.json(projects.map(filterProject));
    }

    function filterProject(project) {
      return filterProjectForUser(project, user);
    }
  },


  /**
   *     `POST /:owner/:repo/deploy`
   */
  deploy: function(req, res) {
    var projectName = req.param('owner') + '/' + req.param('repo');

    Project.findOne({id: projectName}, gotProject);

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
        id: id,
        project: project.id,
        previous_build: project.last_build,
        previous_successful_build: project.last_successful_build,
        created_at: time,
        triggered_by: req.session && req.session.username(),
        repo: project.repo,
        dir: id,
        branch: project.branch,
        commit: 'HEAD',
        type: project.type,
        plugins: project.plugins
      };

      build.branch = project.branch;

      // Set state object
      build.state = 'pending';

      Build.create(build, createdBuild);
    }

    function createdBuild(err, build) {
      if (err) res.send(err.status_code || 500, err);
      else res.jon(build);
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
      Project.get(projectName, gotProject);

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
        id: id,
        project: project.id,
        previous_build: project.last_build,
        previous_successful_build: project.last_successful_build,
        created_at: Date.now(),
        triggered_by: 'Github webhook',
        repo: project.repo,
        dir: id,
        branch: project.branch,
        state: 'pending',
        commit: payload.after,
        type: project.type,
        plugins: project.plugins
      };

      Build.create(build, createdBuild);
    }

    function createdBuild(err, build) {
      if (err) {
        res.send(err.status_code || 500, err);
      } else {
        res.json(build);
      }
    }

  },



  /// Update Plugins

  updatePlugins: function updatePlugins(req, res) {
    var projectName = req.param('owner') + '/' + req.param('repo');

    Project.findOne({id: projectName}, foundProject);

    function foundProject(err, project) {
      if (err) res.send(err.status_code || 500, err);
      else if (! project) res.send(404, new Error('No such project found'));
      else {
        project.plugins = req.body;
        project.save(savedProject);
      }
    }

    function savedProject(err, project) {
      if (err) res.send(err.status_code || 500, err);
      else res.json(project);
    }

  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ProjectController)
   */
  _config: {}


};


/// Misc

function filterProjectForUser(project, user) {
  project.isOwner = (user && project.owners && project.owners.indexOf(user) >= 0);

  if (! project.isOwner)
    delete project.secret;

  return project;
}
