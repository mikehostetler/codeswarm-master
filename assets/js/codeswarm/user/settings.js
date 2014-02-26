define([
  'knockout',
  'request'
],

function(ko, request) {

    var ctor = {

        // Set displayName
        displayName: 'User Settings',

        // Setup model
        fname: ko.observable(),
        lname: ko.observable(),
        email: ko.observable(),
        username: ko.observable(),
        password: ko.observable(),
        confirm_password: ko.observable(),

        // On activate, get info...
        activate: function (context) {
          this.getSettings(context);
        },

        // Define get-info request object
        getSettingsRequest: {
          url: '/users',
          type: 'GET'
        },

        // Request info to populate model
        getSettings: function (user) {
          var req = request(this.getSettingsRequest, { 'user': user });
          req.done(function (data) {
            console.log(data);
          });
        },

        // Define save-info request object
        saveSettingsRequest: {
          url: '/api/user',
          type: 'PUT',
          done: function (data) {
            return data;
          },
          fail: function (err) {
            console.log(err);
          }
        },

        // Save settings handler method
        trySaveSettings: function () {
          // Ensure password match
          if (this.password() === this.confirm_password()) {
            // Define request payload
            var payload = {
              'fname': this.fname(),
              'lname': this.lname(),
              'email': this.email(),
              'username': this.username(),
              'password': this.password()
            };
            // Processes request obj
            request(this.saveSettingsRequest, payload);
          } else {
            alert("Your passwords don't match.");
          }
        }

    };
    return ctor;
});
