var db = require('./');

module.exports = startSession;

var modules = {
  users: require('./users')
};

function startSession(username, sessionId) {
  var ret = {};
  Object.keys(modules).forEach(makeAvailable);
  return ret;

  function makeAvailable(module) {
    ret[module] = function() {
      var couch = db.wrap({
        url: db.base, cookie: 'AuthSession=' + encodeURIComponent(sessionId)
      });
      return modules[module].session(couch, username, sessionId);
    };
  }

}