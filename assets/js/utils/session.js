define([
  'plugins/router',
  'durandal/system',
  'request'
], function (router, system, request) {

  // Client side maintenance of user session information
  var session = {

    data: function (cb) {
      // Return session info
      var req = request({
        url: '/user',
        type: 'GET'
      });

      // Success
      req.done(function (data) {
        if (cb && typeof cb === 'function') {
          cb(false, data);
        }
      });

      // Session fail / DNE
      req.fail(function (err) {
        if (cb && typeof cb === 'function') {
          cb(true, err);
        }
      });
    },

    isLoggedIn: function () {
      this.data(function (err, data) {
        if (err) {
          return false;
        } else {
          return true;
        }
      });
    },

    end: function () {
      var req = request({
        url: '/session',
        type: 'DELETE'
      });

      req.done(function () {
        router.navigate('user/login');
      });

      req.fail(function () {
        router.navigate('user/login');
      });
    }

  };

  return session;

});
