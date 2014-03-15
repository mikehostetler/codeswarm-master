define([
  'knockout',
  'request',
  'dom',
  'session',
  'github',
  'plugins/router'
], function (ko, request, dom, session, Github, router) {

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
    orgs: ko.observableArray(),
    token: ko.observable(),

    // Initialization
    activate: function (org) {
      this.org(null);
      this.orgs([ { login: 'All Projects', rel: '/#projects' } ]);
      // Check org
      if (org !== 'projects') {
        this.org(org.toLowerCase());
      }
      // Setup orgs list
      this.getToken();
      // Load projects
      this.tryGetProjects();
    },

    // Github Integration ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Check for GH API token
    getToken: function () {
      var self = this;
      var req = request({
        url: '/tokens/github',
        type: 'GET'
      });

      req.done(function (data) {
        self.token(data.token);
        self.tryGetUser(data);
      });

      req.fail(function (err) {
        console.error(err);
      });
    },

    // Try to get user
    tryGetUser: function (data) {
      var github = new Github({
        token: this.token(),
        auth: 'oauth'
      });
      var user = github.getUser();
      this.tryGetOrgs(user);
    },

    tryGetOrgs: function (user) {
      var self = this;
      user.orgs(function (err, orgs) {
        if (!err) {
          for (var i=0, z=orgs.length; i<z; i++) {
            orgs[i].rel = '#'+orgs[i].login;
            self.orgs.push(orgs[i]);
          }
          dom.customSelect('select');
        }
      });
    },

    // Get Projects ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
