define([
  'knockout',
  'request'
],

function(ko, request) {

    var ctor = {

        // Set displayName
        displayName: 'Forgot Password',

        // Setup model
        username: ko.observable(),

        // Define request object
        resetPasswordRequest: {
          url: '/api/session',
          type: 'POST'
        },

        // Reset password handler method
        tryResetPassword: function () {
            // Define request payload
            var payload = {
              'username': this.username()
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