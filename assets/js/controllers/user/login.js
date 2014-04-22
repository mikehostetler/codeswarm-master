define([
    'knockout',
    'request',
    'session',
    'dom',
    'durandal/system',
    'plugins/router'
  ],

  function (ko, request, session, dom, system, router) {

    var ctor = {

      canActivate: function () {
        // If session active, goto profile
        session.data(function (err, data) {
          if (!err) {
            router.navigate('/projects');
          }
        });

        return true;
      },

      // Set displayName
      displayName: 'Login',

      // Setup model
      email: ko.observable(),
      password: ko.observable(),

      // Define request object
      loginRequest: {
        url: '/sessions',
        type: 'POST'
      },

      // Login handler method
      tryLogin: function () {
        // Define request payload
        var payload = {
          'email': this.email(),
          'password': this.password()
        };
        // Processes request obj
        var req = request(this.loginRequest, payload);
        req.done(function (data) {
          router.navigate('/projects');
        });
        req.fail(function (err) {
          dom.showNotification('error', JSON.parse(err.responseText).message);
        });
      }

    };
    return ctor;
  });
