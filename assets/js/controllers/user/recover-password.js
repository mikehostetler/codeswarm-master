define([
    'knockout',
    'request',
    'dom',
    'plugins/router'
  ],

  function (ko, request, dom, router) {

    var ctor = {

      // Set displayName
      displayName: 'Forgot Password',

      // Setup model
      email: ko.observable(),
      password: ko.observable(),
      password_confirm: ko.observable(),
      secret: ko.observable(),

      activate: function (secret) {
        if (!secret) {
          router.navigate('/#user/login');
        } else {
          this.secret(secret);
        }
      },

      // Define request object
      resetPasswordRequest: {
        url: '/recover-password',
        type: 'POST'
      },

      // Reset password handler method
      tryResetPassword: function () {
        // Check password match
        if (this.password() !== this.password_confirm()) {
          dom.showNotification('error', 'Passwords must match');
          return false;
        }

        if (this.password().length < 8) {
          dom.showNotification('error', 'Password must be at least 8 characters');
          return false;
        }
        // Define request payload
        var payload = {
          'email': this.email(),
          'password': this.password(),
          'secret': this.secret()
        };
        // Processes request obj
        var req = request(this.resetPasswordRequest, payload);
        req.done(function () {
          dom.showNotification('success', 'Password reset, please log in');
          router.navigate('/#user/login');
        });
        req.fail(function () {
          dom.showNotification('error', 'There was a problem with the information provided');
        });
      }

    };
    return ctor;
  });
