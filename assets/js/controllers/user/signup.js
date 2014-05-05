define([
    'knockout',
    'request',
    'durandal/app',
    'session',
    'plugins/router'
  ],

  function (ko, request, app, session, router) {

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
      displayName: 'Signup',

      // Setup model
      fname: ko.observable(),
      lname: ko.observable(),
      email: ko.observable(),
      password: ko.observable(),
      confirm_password: ko.observable(),

      // Define request object
      signupRequest: {
        url: '/users',
        type: 'POST'
      },

      // Signup handler method
      trySignup: function () {
        // Ensure all fields (sans email; tested later) contain values
        if (this.fname() === undefined || this.lname() === undefined || this.password() === undefined) {
          app.showMessage('Error: ' + 'Please fill out all fields');
          return;
        }

        // Test email
        if (!/\S+@\S+\.\S+/.test(this.email())) {
          app.showMessage('Error: ' + 'Invalid email address');
          return;
        }

        // Check password confirm
        if (this.password() !== this.confirm_password()) {
          app.showMessage('Error: ' + 'Your passwords do not match');
          return;
        }

        // ALL TESTS PASSED

        // Define request payload
        var payload = {
          'fname': this.fname(),
          'lname': this.lname(),
          'email': this.email(),
          'password': this.password()
        };
        // Processes request obj
        var req = request(this.signupRequest, payload);
        req.done(function () {
          router.navigate('/projects');
        });
        req.fail(function (err) {
          app.showMessage('Error: ' + JSON.parse(err.responseText).message);
        });

      }

    };
    return ctor;
  });
