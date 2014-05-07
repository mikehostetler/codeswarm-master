define([
    'durandal/app',
    'plugins/router',
    'knockout',
		'models/user',
		'ko.validate'
  ],

  function (app, router, ko, user) {

		return {

			/**
			 * Local ViewModel Properties
			 */
			displayName: 'Login',
			username: ko.observable().extend({required: true, minLength: 8}),
			password: ko.observable().extend({required: true, minLength: 8}),

			/**
			 * Activate our model, this method is always called
			 */
			activate: function() {
				// If session active, goto profile
				if(user.isLoggedIn()) {
					// Go Home
					//router.navigate('');
				}
			},

			/**
			 * Custom methods
			 */
			frmLogin_Submit: function () {
				// Validate!
				if(this.username.isValid() && this.password.isValid()) {
					
					// Try to login 
					var loginResult = user.tryLogin(this.username(), this.password());
					if(loginResult === true) {
						// Success!
						router.navigate('');
					}
					else {
						// Error, show a message
						app.showMessage('Invalid Username or Password', '');
					}
				}
			}
		}
  });
