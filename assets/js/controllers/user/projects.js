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
			 * local viewmodel properties
			 */
			router: router,

			/**
			 * Activate our model, this method is always called
			 */
			activate: function() {
				// If session active, go home
				user.isLoggedIn(function(isLoggedIn) {
                    alert('I\'m alive!');
				});
			},

			/**
			 * Custom methods
			 */
			frmLogin_Submit: function () {
				// Validate!
				if(this.username.isValid() && this.password.isValid()) {
					
					// Try to login 
					user.tryLogin(this.username(), this.password(), function(loginResult) {
						if(loginResult === true) {
							// Success!
							router.navigate('');
						}
						else {
							// Error, show a message
							app.showMessage('Invalid Username or Password', '');
						}
					});
				}
			}
		};
  });
