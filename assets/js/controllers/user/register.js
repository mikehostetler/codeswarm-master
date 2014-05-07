define([
    'knockout',
    'durandal/app',
    'plugins/router',
		'models/user'
  ],

  function (ko, app, router, user) {
    return {
			/**
			 * Local ViewModel Properties
			 */
      username: ko.observable(),
      email: ko.observable(),
      password: ko.observable(),

			/**
			 * Activate our model, this method is always called
			 */
			activate: function() {
				// If session active, go home
				user.isLoggedIn(function(isLoggedIn) {
					if(isLoggedIn === true) {
						router.navigate('');
					}
				});
			},

			/**
			 * Custom methods
			 */
			frmRegister_Submit: function() {

				// Validate our form
				if(this.username.isValid() 
						&& this.email.isValid()
						&& this.password.isValid()) {

					// Try to login 
					user.createUser(this.username(), 
													this.email(),
													this.password(), 
												function(createResult) {
													if(createResult) {
															// Yay!	
													}
													else {
														// Error, show a message
														app.showMessage('Could not create your account. Please try again');
													}
												});
				}
			}
    }
  });
