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
          type: 'POST',
          done: function (data) {
            console.log(data);
          },
          fail: function (err) {
            console.log(err);
          }
        },

        // Login handler method
        tryLogin: function () {
          // Define request payload
          var payload = {
            'username': this.username(),
            'password': this.password()
          };
          // Processes request obj
          request(this.loginRequest, payload);
        }

    };
    return ctor;
});
