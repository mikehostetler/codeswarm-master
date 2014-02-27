var Cookie = require('cookie');
var db     = require('../db');
var users  = require('../db/users');

/**
 * SessionController
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

var sessionExpirationMs = 1000 * 60 * 60 * 24 * 30; // 30 days
var cookieOptions = {
  path: '/',
  httpOnly: true,
  expires: new Date(Date.now() + sessionExpirationMs)
};

module.exports = {


  /**
   *    `POST /session`
   */
   create: function (req, res) {

    users.authenticate(req.param('username'), req.param('password'), replied);

    function replied(err, sessionId, username, roles) {
      if (err) res.send(err.status_code || 500, err);
      else if (! sessionId) res.send(500, new Error('No session id generated'));
      else {
        var cookie = Cookie.serialize('sid', sessionId, cookieOptions);
        res.setHeader('Set-Cookie', cookie);
        if (sessionId) {
          var user = {
            name: username,
            roles: roles,
            isAdmin: roles.indexOf('admin') >= 0
          };
        }
        res.json({ session: sessionId, user: user });
      }
    }
  },


  /**
   *    `GET /session`
   */
   get: function (req, res) {

    var header = req.headers.cookie;
    var sid;

    if (header) {
      var cookies = Cookie.parse(header);
      sid = cookies.sid;
    }

    if (sid) {
      var sessionDB = db.wrap({
        url: db.base,
        cookie: 'AuthSession=' + encodeURIComponent(sid)
      });

      sessionDB.session(replied);
    } else {
      res.json(404, new Error('No session'));
    }

    function replied(err, session) {
      if (err) err.send(err.status_code || 500, err);
      else {
        res.json({ session: sid, user: session.userCtx.name });
      }
    }
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionController)
   */
  _config: {}


};
