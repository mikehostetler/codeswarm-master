define([
    'durandal/app',
    'plugins/router',
    'knockout',
		'utils/session',
		'ko.validate',
		'models/user'
  ],

  function (app, router, ko, session) {

		var user = require('models/user');

		return {

			activate: function() {
				// If session active, goto profile
				if(user.isLoggedIn()) {
					router.navigate(''); // Go home
				}
			},

			// Set displayName
			displayName: 'Login',

			// Setup model
			username: ko.observable().extend({required: true}),
			password: ko.observable().extend({required: true}),

			// Login handler method
			btnLogin_Click: function () {
				// TODO - Validate login!

				var loginResult = user.tryLogin(this.username(), this.password());

				if(loginResult === true) {
					// Success!
					router.navigate('/');
				}
				else {
					app.showMessage('Invalid Username or Password', '');
				}
			}
		}
  });
