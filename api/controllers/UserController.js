var https      = require('https');
var db     = require('../db');
var users  = require('../db/users');
var uuid   = require('../../lib/uuid');

// Email
var secret_link_expiration_minutes = require('../../config/forgot_password').secret_link_expiration_minutes;
var Email  = require('../services/Email');


/**
 * SessionController
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

module.exports = {


  /**
   *    `POST /users`
   */
  create: function (req, res) {
    users.create(req.body, replied);

    function replied(err) {
      if (err) res.send(err.status_code || 500, err);
      else res.json({ok: true});
    }
  },


  /**
   *    `GET /user`
   */
  get: function (req, res) {
    var user = req.session.username();
    if (! user) return res.send(403, new Error('No user in session'));

    users.get(user, replied);

    function replied(err, user) {
      if (err) res.send(err.status_code || 500, err);
      else res.json(user);
    }
  },


  /**
   *    `PUT /user`
   */
  update: function (req, res) {
    var user = req.session.username();
    if (! user) return res.send(403, new Error('No user in session'));

    users.update(user, req.body, replied);

    function replied(err) {
      if (err) res.send(err.status_code || 500, err);
      else res.json({ok: true});
    }
  },


  /**
   *    `POST /forgot-password`
   */
  forgot_password: function (req, res) {
    var email = req.body.email;
    if (! email) return res.send(400, 'Need email');

    users.get(email, gotUser);

    function gotUser(err, user) {
      if (err && err.status_code == 404) return res.send(404, 'No such user');
      if (err) return res.send(err.status_code || 500, err);

      if (! user) return res.send(404, new Error('User not found'));

      var secret = uuid();
      var secret_expires_at = Date.now() + secret_link_expiration_minutes * 60 * 1000;

      users.update(email, {
        secret: secret,
        secret_expires_at: secret_expires_at
      }, updatedUser);

      function updatedUser(err) {
        console.log('updated user', err);
        if (err) return res.send(err.status_code || 500, err);

        Email.sendSystemEmail({
          template: 'forgot_password',
          to: email,
          subject: 'forgot password recovery',
          data: {
            recover_url: serverUrl(req, '/#/recover-password/' + encodeURIComponent(secret)),
            secret: secret,
            user: user
          }
        }, sentEmail);
      }

      function sentEmail(err) {
        console.log('Sent email', err);
        if (err) return res.send(err.status_code || 500, err);
        res.json({ok: true});
      }
    }
  },

  /**
   *    `POST /recover-password`
   */
  recover_password: function (req, res) {
    var email = req.body.email;
    if (! email) return res.send(400, 'Need email');

    var password = req.body.password;
    if (! password) return res.send(400, 'Need password');

    var secret = req.body.secret;
    if (! secret) return res.send(400, 'Need secret');

    users.get(email, gotUser);

    function gotUser(err, user) {
      if (err && err.status_code == 404) return res.send(404, 'No such user');
      if (err) return res.send(err.status_code || 500, err);

      if (! user) return res.send(404, new Error('User not found'));

      if (secret != user.secret) return res.send(403, new Error('Invalid secret'));

      var secret_expires_at = user.secret_expires_at;
      if (! secret_expires_at || secret_expires_at < Date.now())
        return res.send(404, new Error('secret expired'));

      users.update(email, {
        password: password,
        secret_expires_at: null,
        secret: null
      }, updatedUser);

      function updatedUser(err) {
        if (err) res.send(err.status_code || 500, err);
        else res.json({ok: true});
      }
    }
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionController)
   */
  _config: {}


};


function serverUrl(req, path) {
  var protocol = req.client.server instanceof https.Server ? 'https' : 'http';
  return protocol + '://'+ req.headers.host + path;
}