define([
  'knockout',
  'jquery'
],

function(ko, $) {
    var ctor = {

        // Set displayName
        displayName: 'Login',

        // Setup model
        username: ko.observable(),
        password: ko.observable(),

        // Login handler method
        tryLogin: function () {
          this.request(this.username(), this.password());
        },

        // Make login request
        loginReq: function (username, password) {
          $.ajax({
            url: '/session',
            type: 'POST',
            data: {
              'username': username,
              'password': password
            },
            success: this.loginReqPass,
            failure: this.loginReqFail
          });
        },

        // Request successful
        loginReqPass: function (data) {
          console.log(data);
        },

        // Request failure
        loginReqFail: function (err) {
          console.log(err);
        }

    };
    return ctor;
});
