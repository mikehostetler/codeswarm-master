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
          type: 'POST',
          done: function (data) {
            console.log(data);
          },
          fail: function (err) {
            console.log(err);
          }
        },

        // Reset password handler method
        tryResetPassword: function () {
            // Define request payload
            var payload = {
              'username': this.username()
            };
            // Processes request obj
            request(this.resetPasswordRequest, payload);
        }

    };
    return ctor;
});