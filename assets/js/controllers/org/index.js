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

    // Define model
    projects: ko.observableArray(),
    org: ko.observable(),

    // Initialization
    activate: function (org) {
      this.org(null);
      // Check org
      if (org !== 'projects') {
        this.org(org.toLowerCase());
      }
      this.tryGetProjects();
    },

    // Define request
    projectsReq: {
      url: '/projects',
      type: 'GET'
    },

    tryGetProjects: function () {
      var self = this;
      // Make Request
      var req = request(this.projectsReq);

      // Empty observableArray
      this.projects([]);

      // On success
      req.done(function (data) {
        var org;
        for (var i=0, z=data.length; i<z; i++) {
          org = data[i]._id.substr(0, data[i]._id.indexOf('/')).toLowerCase();
          if (self.org() === null) {
            self.projects.push(data[i]);
          } else {
            if (org === self.org()) {
              self.projects.push(data[i]);
            }
          }
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
