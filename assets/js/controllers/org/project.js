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
    displayName: 'Project',

    // Define model
    _id: ko.observable(),
    title: ko.observable(),
    org: ko.observable(),
    repo: ko.observable(),
    branch: ko.observable(),
    token: ko.observable(),
    stats: ko.observable(),
    config_url: ko.observable(),

    // Initialization
    activate: function (org, repo) {
      this.org(org);
      this.repo(repo);
      this.getToken();
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
        self.tryGetRepo();
      });

      req.fail(function (err) {
        console.error(err);
      });
    },

    // Try to get user
    tryGetRepo: function (data) {
      var self = this;
      var github = new Github({
        token: this.token(),
        auth: 'oauth'
      });
      var repo = github.getRepo(this.org(), this.repo());
      repo.show(function (err, repo) {
        self.stats({
          watchers: repo.watchers,
          subscribers: repo.subscribers_count,
          issues: repo.open_issues,
          forks: repo.forks_count,
          access: (repo.private) ? 'private' : 'public'
        });
      });
      this.tryGetProject();
    },

    // Get Data ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Define get request
    getProjectRequest: {
      url: function () {
        return '/projects/' + ctor.org() + '/' + ctor.repo();
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
        dom.showNotification('error', JSON.parse(err.responseText).message);
      });
    },

  };

  return ctor;
});
