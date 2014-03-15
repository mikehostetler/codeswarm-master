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
    projects: ko.observableArray(),

    // Define request
    projectsReq: {
      url: '/projects',
      type: 'GET'
    },

    tryGetProjects: function () {
      var self = this;
      // Make Request
      var req = request(this.projectsReq);

      // On success
      req.done(function (data) {
        console.log('PROJECTS');
        console.log(data);
        for (var i=0, z=data.length; i<z; i++) {
          self.projects.push(data[i]);
        }
      });

      // On failure
      req.fail(function (err) {
        dom.showNotification('error', JSON.parse(err.responseText).message);
      });
    }

  };

  return ctor;
});
