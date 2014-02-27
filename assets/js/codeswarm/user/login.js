define([
  'knockout',
  'request',
  'session',
  'dom',
	'durandal/system',
	'plugins/router'
],

function(ko, request, session, dom, system, router) {

		if(session.isLoggedIn()) {
			router.navigate('user');
		}

    var ctor = {

        // Set displayName
        displayName: 'Login',

        // Setup model
        username: ko.observable(),
        password: ko.observable(),

        // Define request object
        loginRequest: {
          url: '/sessions',
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
            session.start(data);
          });
          req.fail(function (err) {
            dom.showNotification('error', JSON.parse(err.responseText).message);
          });
        }

    };
    return ctor;
});
