define([
  'knockout',
  'request'
],

function(ko, request) {

    var ctor = {

        // Set displayName
        displayName: 'User Settings',

        // On activate, get info...
        activate: function () {
          this.getSettings();
        },

        // Setup model
        fname: ko.observable(),
        lname: ko.observable(),
        email: ko.observable(),
        username: ko.observable(),
        password: ko.observable(),
        confirm_password: ko.observable(),

        // Define get-info request object
        getSettingsRequest: {
          url: '/api/user',
          type: 'GET',
          done: function (data) {
            this.fname(data.fname);
            this.lname(data.lname);
            this.email(data.email);
            this.username(data.username);
          },
          fail: function (err) {
            this.fname('NO DATA');
            this.lname('NO DATA');
            this.email('NO DATA');
            this.username('NO DATA');
          }
        },

        // Request info to populate model
        getSettings: function (id) {
          request(this.getSettingsRequest, { _id: id });
        },

        // Define save-info request object
        saveSettingsRequest: {
          url: '/api/user',
          type: 'PUT',
          done: function (data) {
            console.log(data);
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
