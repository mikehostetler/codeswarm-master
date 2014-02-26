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

        // Request object
        request: {
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
          var payload = {
            'username': this.username(),
            'password': this.password()
          };
          // Processes request obj
          request(this.request, payload);
        }

    };
    return ctor;
});
