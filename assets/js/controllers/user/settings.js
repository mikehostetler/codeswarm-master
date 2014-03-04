define([
    'knockout',
    'request'
  ],

  function (ko, request) {

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
        url: '/user/settings',
        type: 'GET'
      },

      // Request info to populate model
      getSettings: function (user) {
        var self = this;
        var req = request(this.getSettingsRequest, {
          'user': user
        });
        req.done(function (data) {
          console.log('WE GOT THE DATA!');
          // Set the models...
          self.fname('DATAS');
        });
        req.fail(function () {
          console.log('WE NO HAVE THE DATAS!');
        });
      },

      // Define save-info request object
      saveSettingsRequest: {
        url: '/user/settings',
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
