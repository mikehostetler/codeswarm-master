define([
  'knockout',
  'request'
],

function(ko, request) {

    var ctor = {

        // Set displayName
        displayName: 'Forgot Password',

        // Setup model
        email: ko.observable(),

        // Define request object
        resetPasswordRequest: {
          url: '/api/session',
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
              console.log('DATA!');
            });
            req.fail(function () {
              console.log('FAIL');
            });
        }

    };
    return ctor;
});