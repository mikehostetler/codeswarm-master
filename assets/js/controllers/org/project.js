define([
  'knockout',
  'request',
  'session',
  'utils/github',
  'durandal/app',
  'plugins/router'
], function (ko, request, session, github, app, router) {

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
    displayName: 'Project',

    // Define model
    _id: ko.observable(),
    title: ko.observable(),
    org: ko.observable(null),
    repo: ko.observable(null),
    branch: ko.observable(),
    token: ko.observable(),
    stats: ko.observable(),
    config_url: ko.observable(),

    // Initialization
    activate: function (org, repo) {
      this.org(org);
      this.repo(repo);
      this.tryGetRepo();
    },

    // Github Integration ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Try to get user
    tryGetRepo: function () {
      var self = this;
      github.getRepo(this.org(), this.repo(), function (err, repo) {
        if (err) {
          app.showMessage('Error: ' + err);
        } else {
          repo.show(function (err, repo) {
            self.stats({
              watchers: repo.watchers,
              subscribers: repo.subscribers_count,
              issues: repo.open_issues,
              forks: repo.forks_count,
              access: (repo.private) ? 'private' : 'public'
            });
          });
        }
      });
      // Load project
      this.tryGetProject();
    },

    // Get Data ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Get project
    tryGetProject: function () {
      var self = this;

      // Make Request
      var req = request({
        url: '/projects/' + this.org() + '/' + this.repo(),
        type: 'GET'
      });

      // On success
      req.done(function (data) {
        // Loop through data response
        self._id(data._id);
        self.title(data.title);
        self.repo(data.repo);
        self.branch(data.branch);

        // Config URL
        self.config_url('/#/' + data._id + '/config');
      });

      // On failure
      req.fail(function (err) {
        app.showMessage('Error: ' + JSON.parse(err.responseText).message);
      });
    },

  };

  return ctor;
});
