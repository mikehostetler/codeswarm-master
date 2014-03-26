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

    var project = req.param('owner') + '/' + req.param('repo');
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

    var project = req.param('owner') + '/' + req.param('repo');
    Build.findOne({id: req.param('build')}, replied);

    function replied(err, build) {
      if (err) res.send(err.status_code || 500, err);
      else if (! build) res.send(404, new Error('Build not found'));
      else if (build.project != project) return res.send(404, new Error('Build not found'));
      else res.json(Build.forShow(build));
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
    project: build.project
  }
}