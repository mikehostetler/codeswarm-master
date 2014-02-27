define([
  'knockout',
  'request',
  'dom'
],

function(ko, request, dom) {

    var ctor = {

        // Set displayName
        displayName: 'Signup',

        // Setup model
        username: ko.observable(),
        password: ko.observable(),
        confirm_password: ko.observable(),

        // Define request object
        signupRequest: {
          url: '/users',
          type: 'POST'
        },

        // Signup handler method
        trySignup: function () {
          // Check password confirm
          if (this.password() === this.confirm_password()) {
            // Define request payload
            var payload = {
              'username': this.username(),
              'password': this.password()
            };
            // Processes request obj
            var req = request(this.signupRequest, payload);
            req.done(function () {
              location.href = '/';
            });
            req.fail(function (err) {
              dom.showNotification('error', JSON.parse(err.responseText).message);
            });
          } else {
            dom.showNotification('error', 'Your passwords do not match');
          }
        }

    };
    return ctor;
});