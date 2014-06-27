/**
 * BuildController
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


module.exports = {


  /**
   * Action blueprints:
   *    `/build/index`
   *    `/build`
   */
	index: function (req, res) {
		var project = req.param('project-id');	
    Build.findByProject(project, replied);
    function replied(err, builds) {
      if (err) res.send(err.status_code || 500, err);
      else res.json(builds.map(forList));
    }
  },


  /**
   * Action blueprints:
   *    `/build/find`
   */
   find: function (req, res) {

		var project = req.param('project-id');	
		var build = req.param('build');	

    Build.findOne({id: build}, replied);
    function replied(err, build) {
      if (err) res.send(err.status_code || 500, err);
      else if (! build) res.send(404, new Error('Build not found'));
      else if (build.project != project) return res.send(404, new Error('Build not found'));
      else res.json(Build.forShow(build));
    }
  },

  byTag: function (req, res) {
		var project = req.param('project-id');	

    async.parallel({
      project: loadProject,
      buildsByTag: loadBuildsByTag
    }, done);

    function loadProject(cb) {
      Project.findOne({id: project}, cb);
    }

    function loadBuildsByTag(cb) {
      Build.view('by_project_and_tag', {
        startkey: [project, '\u0000', 0],
        endkey: [project, '\ufff0', Number.MAX_VALUE]
      }, foundBuilds);

      function foundBuilds(err, builds) {
        if (err) return cb(err);

        var tags = {};
        builds.forEach(function(build) {
          (build.tags || []).forEach(function(tag) {
            var builds = tags[tag];
            if (! builds) builds = tags[tag] = [];
            builds.push(forList(build));
          });
        });

        cb(null, tags);
      }
    }


    function done(err, results) {
      if (err) return res.send(err.status_code || 500, err);
      var tags = {};

      var project = results.project;
      var buildsByTag = results.buildsByTag;

      (project.tags || []).forEach(function(tag) {
        tag = tag.name;
        tags[tag] = buildsByTag[tag] || [];
      });

      res.json(tags);
    }
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to BuildController)
   */
  _config: {}


};

/// Mappings

function forList(build) {
  return {
    id: build.id,
    created_at: build.created_at,
    started_at: build.started_at,
    ended_at:   build.ended_at,
    state:      build.state,
    branch:     build.branch,
    triggered_by: build.triggered_by,
    project:    build.project,
    tags:       build.tags
  }
}


/// Misc

function prop(p) {
  return function(o) {
    return o[p];
  };
}
