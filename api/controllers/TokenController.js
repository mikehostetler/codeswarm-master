/**
 * TokenController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
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

var db       = require('../db');
var tokens   = require('../db/tokens');
var users    = require('../db/users');

var providers = {
  github: require('../../lib/github')
};


module.exports = {


  /**
   *    `POST /tokens/:provider`
   */
  create: function (req, res, next) {
    var providerName = req.param('provider');
    var provider = providers[providerName];
    if (! provider) res.send(404, 'No such provider');
    else {
      provider.authenticate(req, res, next);
    }
  },


  /**
   *    `POST /tokens/:provider/callback`
   */
  callback: function(req, res, next) {
    var providerName = req.param('provider');
    var provider = providers[providerName];
    if (! provider) res.send(404, 'No such provider');
    else {
      provider.callback(req, res, afterCallback);
    }

    function afterCallback(err) {
      if (err) res.send(500, err);
      else {
        if (! req.user) res.send(404, 'User needs to be authenticated');
        else if (! req.session.token) res.send(500, 'User should have a token by now');
        else if (! req.session.remoteUsername) res.send(500, 'User should have a remote username by now');
        else {
          tokens.create(req.user, providerName, req.session.token, req.session.remoteUsername, createdToken);
        }
      }
    }

    function createdToken(err) {
      if (err) res.send(err.status_code || 500, err);
      else res.redirect('/#/project/new');
    }
  },


  /**
   *    `GET /tokens/:provider`
   */
  find: function (req, res) {

    var user = req.session.username();
    if (! user) throw new Error('No username????');

    var provider = req.param('provider');

    tokens.get(user, provider, replied);

    function replied(err, token) {
      if (err && err.status_code != 404) res.send(err.status_code || 500, err);
      else if (! token) res.send(404, new Error('Not found'));
      else res.json(token);
    }
  },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ProjectController)
   */
  _config: {}


};
