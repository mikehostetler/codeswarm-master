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
        fname: ko.observable(),
        lname: ko.observable(),
        email: ko.observable(),
        password: ko.observable(),
        confirm_password: ko.observable(),

        // Define request object
        signupRequest: {
          url: '/users',
          type: 'POST'
        },

        // Signup handler method
        trySignup: function () {
          // Test email
          if (!/\S+@\S+\.\S+/.test(this.email())) {
            dom.showNotification('error', 'Invalid email address');
            return;
          }

          // Check password confirm
          if (this.password() !== this.confirm_password()) {
            dom.showNotification('error', 'Your passwords do not match');
            return;
          }

          // Ensure all (untested) fields contain values
          if (this.fname()==='' || this.lname()==='' || this.password()==='') {
            dom.showNotification('error', 'Please fill out all fields');
            return;
          }

          // ALL TESTS PASSED

          // Define request payload
          var payload = {
            'fname': this.fname(),
            'lname': this.lname(),
            'email': this.email(),
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

        }

    };
    return ctor;
});