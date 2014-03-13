/**
 * PluginController
 *
 * @module      :: Controller
 * @description ::
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var projectTypes = require('../../config/project_types');

module.exports = {

  list: function(req, res) {
    var type = req.param('type');
    if (! type) return res.send(409, 'No type defined');

    var plugins = projectTypes[type] || [];
    var configs = {};

    plugins.forEach(function(plugin) {
      var config = require(plugin).config;
      if (config) configs[plugin] = config;
    });

    res.json(configs);
  }

};