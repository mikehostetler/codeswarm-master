define([
  'knockout',
  'request',
  'dom',
  'utils/github',
  'session',
  'plugins/router'
], function (ko, request, dom, github, session, router) {

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
    displayName: 'Project Config',

    // Initialization
    activate: function (org, repo) {
      // Set param props
      this.param_org = org;
      this.param_repo = repo;
      // If not new project, load data from endpoint
      if (repo !== 'new-project') {
        this.tryGetProject();
        this.newProject = ko.observable(false);
      } else {
        this.newProject = ko.observable(true);
      }
      // Get tokens
      this.getToken();
    },

    compositionComplete: function () {
      // Activate sidebar switcher
      dom.sidebarSwitcher();
    },

    // Define model
    token: ko.observable(false),
    title: ko.observable(),
    repo: ko.observable(),
    branch: ko.observable(),
    public: ko.observable(),
    repos: ko.observableArray(),

    getToken: function () {
      var self = this;
      github.getToken(function (token) {
        if (token) {
          self.token(token);
        }
      });
    },

    // Try to get repos
    tryGetRepos: function () {
      var self = this;
      github.getAvailableRepos(this.token(), function (err, repos) {
        if (err) {
          console.log('GH ERROR:', err);
        } else {
          console.log('REPOS', repos);
          self.repos(repos);
        }
      });
    },

    // Define get request
    getProjectRequest: {
      url: function () {
        return '/projects/' + ctor.param_org + '/' + ctor.param_repo;
      },
      type: 'GET'
    },

    // Get project
    tryGetProject: function () {
      var self = this;

      // Make Request
      var req = request(this.getProjectRequest);

      // On success
      req.done(function (data) {
        console.log(data);
        // Loop through data response
        for (var prop in data) {
          // Assing model attr value with returned val
          self[prop](data[prop]);
        }
      });

      // On failure
      req.fail(function (err) {
        dom.showNotification('error', JSON.parse(err.responseText).message);
      });
    },

    // Define save project request
    saveProjectRequest: {
      url: function () {
        if (ctor.newProject) {
          return '/projects';
        } else {
          return '/projects/' + ctor.param_org + '/' + ctor.param_repo;
        }
      },
      type: 'PUT'
    },

    trySaveProject: function () {

      // Set payload
      var payload = {
        title: this.title(),
        repo: this.title(),
        sha: this.sha(),
        branch: this.branch()
      };

      // If new project, set to POST
      if (this.newProject()) {
        this.saveProjectRequest.type = 'POST';
      }

      // Make request
      var req = request(this.saveProjectRequest, payload);

      // On success
      req.done(function (data) {
        dom.showNotification('success', 'Project successfully saved');
      });

      // On failure
      req.fail(function (err) {
        dom.showNotification('error', JSON.parse(err.responseText).message);
      });
    }

  };

  return ctor;
});
