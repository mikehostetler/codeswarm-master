define([
  'knockout',
  'request',
  'dom',
  'session',
  'plugins/router'
], function (ko, request, dom, session, router) {

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
    activate: function (context) {
      this.tryGetProjects();
    },

    // Define model
    SOMEPROPERTY: ko.observable(),

    // Define request
    projectsReq: {
      url: '/projects',
      type: 'GET'
    },

    tryGetProjects: function () {
      // Set payload
      var payload = {};
      // Make Request
      var req = request(this.projectsReq, payload);

      // On success
      req.done(function (data) {
        console.log(data);
      });

      // On failure
      req.fail(function (err) {
        dom.showNotification('error', JSON.parse(err.responseText).message);
      });
    }

  };

  return ctor;
});
