define([
  'github',
  'request'
], function (Github, request) {

  var github = {

    // Check for GH API token
    getToken: function (cb) {
      var req = request({
        url: '/tokens/github',
        type: 'GET'
      });

      req.done(function (data) {
        cb(null, data.token);
      });

      req.fail(function (err) {
        cb(err, null);
      });
    },

    // Get Repo object
    getRepo: function (owner, repo, cb) {
      this.getToken(function (err, token) {
        if (!err) {
          var github = new Github({
            token: token,
            auth: 'oauth'
          });
          var repo_obj = github.getRepo(owner, repo);
          cb(null, repo_obj);
        } else {
          cb(err, null);
        }
      });
    },

    // Get User object
    getUser: function (cb) {
      this.getToken(function (err, token) {
        if (!err) {
          var github = new Github({
            token: token,
            auth: 'oauth'
          });
          var user_obj = github.getUser();
          cb(null, user_obj);
        } else {
          cb(err, null);
        }
      });
    }
  };

  return github;

});
