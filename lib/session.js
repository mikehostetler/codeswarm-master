var Cookie = require('cookie');
var db     = require('../db');

module.exports = session;

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
    if (err) err.send(err.status_code || 500, err);
    else {
      req.session = session;
      next();
    }
  }
}