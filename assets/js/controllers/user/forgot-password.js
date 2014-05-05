define([
    'knockout',
    'request',
    'durandal/app'
  ],

  function (ko, request, app) {

    var ctor = {

      // Set displayName
      displayName: 'Forgot Password',

      // Setup model
      email: ko.observable(),

      // Define request object
      resetPasswordRequest: {
        url: '/forgot-password',
        type: 'POST'
      },

      // Reset password handler method
      tryResetPassword: function () {
        // Define request payload
        var payload = {
          'email': this.email()
        };
        // Processes request obj
        var req = request(this.resetPasswordRequest, payload);
        req.done(function () {
          app.showMessage('Success: ' + 'Password reset, please check your email');
        });
        req.fail(function () {
          app.showMessage('Error: ' + 'There was a problem with the email you provided');
        });
      }

    };
    return ctor;
  });
