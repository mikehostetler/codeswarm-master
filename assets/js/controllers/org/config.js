define([
  'knockout',
  'request',
  'dom',
  'github',
  'session',
  'plugins/router',
  'base64',
], function (ko, request, dom, Github, session, router) {

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
      if (!org || !repo) {
        this.newProject = ko.observable(true);
      } else {
        this.tryGetProject();
        this.newProject = ko.observable(false);
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
    type: ko.observable(),
    repos: ko.observableArray(),
    availableBranches: ko.observableArray(),

    // GITHUB INTEGRATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Check for GH API token
    getToken: function () {
      var self = this;
      var req = request({
        url: '/tokens/github',
        type: 'GET'
      });

      req.done(function (data) {
        self.token(data.token);
        self.tryGetUser();
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
      this.tryGetRepos(user);
    },

    // Try to get org and user repos
    tryGetRepos: function (user) {
      var self = this;
      user.repos('admin', function (err, repos) {
        self.listRepos(repos);
      });

      // Get orgs
      user.orgs(function (err, orgs) {
        if (!err) {
          for (var org in orgs) {
            getOrgRepos(orgs[org].login);
          }
        }
      });

      var getOrgRepos = function (org) {
        user.orgRepos(org, function(err, repos) {
          self.listRepos(repos);
        });
      };
    },

    // List out repo in DOM via bindings
    listRepos: function (repos) {
      for (var i=0, z=repos.length; i<z; i++) {
        this.repos.push({
          name: repos[i].full_name,
          url: repos[i].clone_url,
          forks: repos[i].forks_count,
          stars: repos[i].stargazers_count,
          watchers: repos[i].watchers_count,
          branches_url: repos[i].branches_url,
          default_branch: repos[i].default_branch
        });
      }
    },

    // Handle selection from repo list
    selectRepo: function (data) {
      // Switch to repo view
      dom.sidebarSwitcher('repo');
      // Set values
      ctor.title(data.name.substring(data.name.indexOf('/') + 1));
      ctor.repo(data.url);
      ctor.availableBranches.push(['GETTING BRANCHES...']);
      // Populate branches
      var github = new Github({
        token: ctor.token(),
        auth: 'oauth'
      });

      // Populate availableBranches
      var repo_opts = data.name.split('/');
      var repo = github.getRepo(repo_opts[0], repo_opts[1]);
      repo.listBranches(function (err, branches) {
        // Clear array
        ctor.availableBranches([]);
        if (err) {
          ctor.availableBranches.push('master');
        } else {
          // Set default branch as first option
          ctor.availableBranches.push(data.default_branch);
          // Loop and add all other branches
          for (var i = 0, z =branches.length; i<z; i++) {
            if (branches[i]!==data.default_branch) {
              ctor.availableBranches.push(branches[i]);
            }
          }
          // Apply style
          dom.customSelect('select');
        }
      });
    },

    // GET PROJECT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

    // SAVE PROJECT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
        repo: this.repo(),
        type: this.type() || 0,
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
