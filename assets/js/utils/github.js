define([
  'request',
  'async',
  'github'
], function (request, async, Github) {

  var github = {

    getAvailableRepos: function (cb) {
      async.parallel({
        githubRepos: this.getGithubRepos,
        userRepos: this.getUserRepos
      }, this.gotRepos);
    },

    getGithubRepos: function (cb) {
      var github = new Github({
        token: token,
        auth: 'oauth'
      });
      var user = github.getUser();
      user.repos('admin', cb);
    },

    getUserRepos: function (cb) {
      requests.get('/projects').
        done(function(repos) {
        cb(null, repos);
      }).
      fail(error.xhrToCallback(cb));
    },

    gotRepos: function(err, results) {
      if (results) {
        var githubRepos = results.githubRepos;
        var userRepos = results.userRepos;
      }

      if (githubRepos) {
        githubRepos.sort(this.sortGithubRepos);
      }

      if (githubRepos && userRepos) {
        var userReposMap = {};
        userRepos.forEach(function(userRepo) {
          userReposMap[userRepo._id] = userRepo;
        });

        var repos = githubRepos.map(function(githubRepo) {
          var repoId = githubRepo.full_name;
          var userRepo = userReposMap[repoId];
          return {
            github: githubRepo,
            userRepo: userRepo,
            userHasRepo: !! userRepo
          }
        });
      },

      sortGithubRepos: function (a, b) {
        return a.full_name < b.full_name ? -1 : 1;
      }
    }


  };

  return github;

});