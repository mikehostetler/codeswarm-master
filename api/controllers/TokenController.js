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
          var tokens = {};
          tokens[providerName] = {
            token: req.session.token,
            username: req.session.remoteUsername
          };

          User.merge(User.userIdFromEmail(req.user), {tokens: tokens}, savedTokens);
        }
      }
    }

    function savedTokens(err) {
      if (err) res.send(err.status_code || 500, err);
      else res.redirect('/#/project/new');
    }
  },


  /**
   *    `GET /tokens/:provider`
   */
  find: function (req, res) {

    var user = req.user.username;
    if (! user) return res.send(403, new Error('No user session'));

    var provider = req.param('provider');

    User.findOne({id: User.userIdFromEmail(user)}, foundUser);

    function foundUser(err, user) {
      var token = user && user.tokens && user.tokens[provider];
      if (err && err.status_code != 404) res.send(err.status_code || 500, err);
      else if (! token) res.send(404, new Error('Not found'));
      else res.json(token);
    }
  }


};
