var extend   = require('util')._extend;
var Cookie   = require('cookie');
var passport = require('../lib/passport');
var db       = require('../api/db');

module.exports = {

  // Custom express middleware - we use this to register the passport middleware
  express: {
    customMiddleware: function(app) {
      app.use(session);
      app.use(passport.initialize());
    }
  }

};

function session(req, res, next) {

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
  } else next();

  function replied(err, session) {
    if (err) res.send(err.status_code || 500, err);
    else {
      if (! req.session) req.session = {};
      if (! session || ! session.userCtx || ! session.userCtx.name)
        session = null;
      req.session.couchdb = session;
      req.session.username = getUsername;
      req.session.hasRole = hasRole;
      next();
    }
  }
}

function getUsername() {
  return this.couchdb && this.couchdb.userCtx && this.couchdb.userCtx.name;
}

function hasRole(role) {
  var has = false;
  var roles = this.couchdb && this.couchdb.userCtx && this.couchdb.userCtx.roles;
  if (roles) has = roles.indexOf(role) >= 0;

  return has;
}