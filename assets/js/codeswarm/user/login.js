define([
  'knockout',
  'request'
],

function(ko, request) {

    var ctor = {

        // Set displayName
        displayName: 'Login',

        // Setup model
        username: ko.observable(),
        password: ko.observable(),

        // Define request object
        loginRequest: {
          url: '/api/session',
          type: 'POST'
        },

        // Login handler method
        tryLogin: function () {
          // Define request payload
          var payload = {
            'username': this.username(),
            'password': this.password()
          };
          // Processes request obj
          var req = request(this.loginRequest, payload);
          req.done(function (data) {
            console.log(data);
          });
          req.fail(function () {
            console.log('FAIL');
          });
        }

    };
    return ctor;
});
