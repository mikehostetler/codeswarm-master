define([
  'knockout',
  'request',
  'dom'
],

function(ko, request, dom) {

    var ctor = {

        // Set displayName
        displayName: 'Forgot Password',

        // Setup model
        email: ko.observable(),

        // Define request object
        resetPasswordRequest: {
          url: '/user/password',
          type: 'GET'
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
              dom.showNotification('success', 'Password reset, please check your email');
            });
            req.fail(function () {
              dom.showNotification('error', 'There was a problem with the email you provided');
            });
        }

    };
    return ctor;
});