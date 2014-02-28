define([
  "controllers/dom",
  "controllers/requests",
  "controllers/router"
], function (dom, requests, Router) {
  var users;

  users = {

    getSignup: function () {

      var self = this,
        router = new Router();

      $(dom.signup).on("submit", function (e) {
        console.log('submitting');
        e.preventDefault();
        var $this = $(this),
          username = dom.getValue($this, "username"),
          password = dom.getValue($this, "password"),
          req = requests.post("/users", {
            username: username,
            password: password
          });

        req.done(function () {
          router.go("/");
        });

        req.fail(dom.showXhrError);
      });
    },

    setCurrent: function(user) {
      localStorage.setItem('user', JSON.stringify(user));
    },

    clearCurrent: function() {
      localStorage.removeItem('user');
    },

    getCurrent: function() {
      var user = localStorage.getItem('user');
      if (user) user = JSON.parse(user);
      return user;
    }

  };

  return users;

});
