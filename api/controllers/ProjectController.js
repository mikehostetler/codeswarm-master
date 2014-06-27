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
var extend   = require('util')._extend;
var uuid     = require('../../lib/uuid');

var repoRegexp = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?\.git$/;

module.exports = {

	/*
		'get /projects/:provider': { controller: 'ProjectController', action: 'gatherByProvider' },
		
		// List available projects
    'get /projects': { controller: 'ProjectController', action: 'list' },
    'get /:project-id': { controller: 'ProjectController', action: 'find' },
	
		// Edit & Delete 
    'post /:project-id': { controller: 'ProjectController', action: 'edit' },
    'post /:project-id/plugins': { controller: 'ProjectController', action: 'updatePlugins' },
    'delete /:project-id': { controller: 'ProjectController', action: 'delete' },
		*/
  /**
   * `GET /projects/:provider`
	 *	List projects available on the provider
   */
	gatherByProvider: function gatherByProvider (req, res) {
	},

  /**
   * Action blueprints:
   *    `POST /projects`
   */
  create: function (req, res) {
    var project = req.body;
    project.public = project.public == 'true';
    project.owners = [req.user.username];

    Project.create(project, replied);

    function replied(err, reply) {
      if (err) {
        res.json(err.status_code || 500, err);
      }
      else res.json(reply);
    }
  },

  /**
   * Action blueprints:
   *    `PUT /projects/:owner/:repo`
   */
	edit: function (req, res) {
		var id = req.param('project-id');	
    req.body.public = !! req.body.public;

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
		sails.log.silly("ProjectController::find");
		var id = req.param('project-id');	
    Project.findOne({id: id}, replied);
    function replied(err, project) {
      if (err) res.send(err.status_code || 500, err);
      else if (! project) res.send(404, new Error('Not found'));
      else {
        var user = req.user.username;
        if (project.public || user && project.owners.indexOf(user) >= 0)
          res.send(filterProjectForUser(project, user));
        else res.send(404, new Error('Not Found'));
      }
    }
  },

  /**
   *    `GET /projects/:owner/:repo/tags`
   */
  tags: function (req, res) {
    var id = req.param('owner') + '/' + req.param('repo');

    Project.findOne({id: id}, replied);

    function replied(err, project) {
      if (err) res.send(res.status_code || 500, err);
      else if (! project) res.send(404, new Error('Not found'));
      else {
        var tags = project.tags || [];
        var starredTags = project.starred_tags || [];
        var tagContent = project.tag_content || {};
        tags.forEach(function(tag) {
          if (starredTags.indexOf(tag.name) >= 0) tag.starred = true;
          var content = tagContent[tag.name];
          if (content) extend(tag, content);
        });
        res.json(tags);
      }
    }
  },

  /**
   *    `GET /projects`
   */
  list: function (req, res) {
    var user = req.user.username;
    var search = req.param('search');

    if (! user) {
      res.send(403, new Error('You need to be logged in for now'));
    } else if (! search) {
      Project.findByOwners(user, replied);
    } else {
      doSearch();
    }

    function replied(err, projects) {
      if (err) res.send(err.status_code || 500, err);
      else res.json(projects.map(filterProject));
    }

    function filterProject(project) {
      return filterProjectForUser(project, user);
    }

    function doSearch() {
      async.parallel({
        owner: searchOwner,
        public: searchPublic
      }, results);


      function searchOwner(cb) {
        searchUser(user, cb);
      }

      function searchPublic(cb) {
        searchUser('public', cb);
      }

      function searchUser(user, cb) {
        Project.view('owner_id_begins_with', {
          startkey: [user, search],
          endkey: [user, search + '\ufff0']}, cb);
      }

      function results(err, results) {
        var projects = [];
        var scannedProjects = {};
        if (err) res.send(err.status_code || 500, err);
        else {
          Object.keys(results).forEach(function(type) {
            var typeResults = results[type];
            typeResults.forEach(maybeAddProject);
          });

          res.json(projects.map(filterProject).sort(byId));
        }

        function maybeAddProject(project) {
          if (! scannedProjects[project.id]) {
            scannedProjects[project.id] = true;
            projects.push(project);
          }
        }
      }
    }
  },

  // destroy
  destroy: function destroy(req, res) {
		var projectId = req.param('project-id');	

    async.series([
      getProject,
      validateAuthorization,
      deleteProject],
		reply);

    var project;

    function getProject(cb) {
			Project.findOne({id: projectId}, gotProject);

      function gotProject(err, _project) {
        if (_project) project = _project;
        cb(err);
      }
    }

    function validateAuthorization(cb) {
      if (! project.owners)
        return res.forbidden('No project owners');
      if (project.owners.indexOf(req.user.username) < 0)
        return res.forbidden('you are not an owner of ' + projectId);
      cb();
    }


    function deleteProject(cb) {
			console.log("Try and destroy!",projectId);
      Project.destroy({id: projectId},function(err) {
					console.log("Destroyed?",err);
					cb(err);
				});
    }

    function reply(err) {
			console.log("Finally here!");
      if (err) return res.send(err.status_code || 500, err);
      else return res.json({ok: true});
    }
  },

  /**
   *     `POST /:owner/:repo/deploy`
   */
  deploy: function(req, res) {
		var projectId = req.param('project-id');	

    Project.findOne({id: projectId}, gotProject);

    function gotProject(err, project) {
      if (! err && ! project) {
        err = new Error('Could not find project');
        err.status_code = 404;
      }

      if (err) return res.send(err.status_code || 500, err);

      if (! project.type) return res.send(500, new Error('no project type defined'));

      var run = true;
      if (project.state == 'running') {
        var timeout = project.started_at + sails.config.codeswarm.timeout_ms;
        run = timeout < Date.now();
      }

      //if (! run) return res.send(400, new Error('Build is still running, please wait...'));

      var id = uuid();
      var time = Date.now();

      var build = {
        id: id,
        project: project.id,
        previous_build: project.last_build,
        previous_successful_build: project.last_successful_build,
        created_at: time,
        triggered_by: req.user.username,
        repo: project.repo,
        dir: id,
        branch: project.branch,
        commit: req.body && req.body.tag || 'HEAD',
        type: project.type,
        plugins: project.plugins || '{}',
        state: 'pending',
        fresh: true
      };

      build.branch = project.branch;

      // Set state object
      build.state = 'pending';

      Build.create(build, createdBuild);
    }

    function createdBuild(err, build) {
      if (err) res.send(err.status_code || 500, err);
      else res.json(build);
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
        plugins: project.plugins,
        fresh: true
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
    var projectId = req.param('project-id');

    Project.findOne({id: projectId}, foundProject);

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

  }


};


/// Misc

function filterProjectForUser(project, user) {
  project.isOwner = (user && project.owners && project.owners.indexOf(user) >= 0);

  if (! project.isOwner)
    delete project.secret;

  delete project.tags;

  return project;
}


function byId(projA, projB) {
  return projA.id < projB.id ? -1 : 1;
}
