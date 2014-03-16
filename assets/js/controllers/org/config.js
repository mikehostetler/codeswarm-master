define([
  'knockout',
  'request',
  'dom',
  'utils/github',
  'session',
  'plugins/router',
  'base64',
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

    // Define model
    token: ko.observable(false),
    _id: ko.observable(),
    repo: ko.observable(),
    branch: ko.observable(),
    type: ko.observable(),
    repos: ko.observableArray(),
    availableBranches: ko.observableArray(),
    public: ko.observable(false),

    // Initialization
    activate: function (org, repo) {
      // Set param props
      this.param_org = org;
      this.param_repo = repo;
      // If not new project, load data from endpoint
      if (!org || !repo) {
        this.newProject = ko.observable(true);
        this._id(null);
        this.repo(null);
        this.branch(null);
        this.type(null);
      } else {
        this.tryGetProject();
        this.newProject = ko.observable(false);
      }
      // Get tokens
      this.tryGetRepos();
    },

    compositionComplete: function () {
      // Activate sidebar switcher
      dom.sidebarSwitcher();
    },

    // GITHUB INTEGRATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Try to get org and user repos
    tryGetRepos: function () {

      this.repos([]);
      var self = this;

      github.getUser(function (err, user) {
        if (err) {
          dom.showNotification('error', err);
        } else {
          self.token(true);
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
            user.orgRepos(org, function (err, repos) {
              self.listRepos(repos);
            });
          };
        }
      });
    },

    // List out repo in DOM via bindings
    listRepos: function (repos) {
      for (var i = 0, z = repos.length; i < z; i++) {
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
      ctor._id(data.name);
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
          for (var i = 0, z = branches.length; i < z; i++) {
            if (branches[i] !== data.default_branch) {
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
        console.log('DATA', data);
        // Loop through data response
        self._id = data._id;
        self.repo = data.repo;
        self.branch = data.branch;
        self.type = data.type;
        self.public = data.public;
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
        repo: this.repo(),
        public: this.public() || false,
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
