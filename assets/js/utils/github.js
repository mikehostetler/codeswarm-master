define([
  'request',
  'async',
  'github'
], function (request, async, Github) {

  var github = {

    // Get tokens
    getToken: function (cb) {
      var req = request({
        url: '/tokens/github',
        type: 'GET'
      });

      // Success
      req.done(function (data) {
        cb(data.token);
      });

      // Fail
      req.fail(function () {
        cb(false);
      });
    },

    getAvailableRepos: function (cb) {
      async.parallel({
        githubRepos: this.getGithubRepos,
        userRepos: this.getUserRepos
      }, this.gotRepos);
    },

    getGithubRepos: function (cb) {
      var github = new Github({
        token: this.token,
        auth: 'oauth'
      });
      var user = github.getUser();
      user.repos('admin', cb);
    },

    getUserRepos: function (cb) {
      request({
        url: '/projects',
        type: 'GET'
      }).
      done(function (repos) {
        cb(null, repos);
      }).
      fail(function (err) {
        cb(err);
      });
    },

    gotRepos: function (err, results) {
      var githubRepos, userRepos, repos;
      if (results) {
        githubRepos = results.githubRepos;
        userRepos = results.userRepos;
      }

      if (githubRepos) {
        githubRepos.sort(this.sortGithubRepos);
      }

      if (githubRepos && userRepos) {
        var userReposMap = {};
        userRepos.forEach(function (userRepo) {
          userReposMap[userRepo._id] = userRepo;
        });

        repos = githubRepos.map(function (githubRepo) {
          var repoId = githubRepo.full_name;
          var userRepo = userReposMap[repoId];
          return {
            github: githubRepo,
            userRepo: userRepo,
            userHasRepo: !! userRepo
          };
        });
      }
    },

    sortGithubRepos: function (a, b) {
      return a.full_name < b.full_name ? -1 : 1;
    }

  };

  return github;

});
