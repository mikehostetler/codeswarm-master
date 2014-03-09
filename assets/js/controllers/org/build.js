define([
  'knockout',
  'request',
  'session',
  'plugins/router'
], function (ko, request, session, router) {

  var ctor = {

    // Check that user is logged in
    canActivate: function () {
      session.isLoggedIn(function (sess) {
        if (!sess) {
          router.navigate('/user/login');
        }
      });
      // This is required for Durandal
      return true;
    },

    // Set displayName
    displayName: 'About CodeSwarm',

    // Initialization
    activator: function (context) {

    },

    // Define model
    SOMEPROPERTY: ko.observable(),

    // Define request
    someReq: {
      url: '/ENDPOINT',
      type: 'GET'
    },

    trySomeReq: function () {
      // Set payload
      var payload = {

      };
      // Make Request
      var req = request(this.someReq, payload);

      // On success
      req.done(function (data) {

      });

      // On failure
      req.fail(function (err) {

      });
    }

  };

  return ctor;
});
