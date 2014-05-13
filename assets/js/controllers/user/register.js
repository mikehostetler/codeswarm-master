define([
    'knockout',
    'durandal/app',
    'plugins/router',
		'models/user',
		'ko.validate'
  ],

  function (ko, app, router, User) {
    return {
			/**
			 * Local ViewModel Properties
			 */
			router: router,
			username: ko.observable().extend({required: true, minLength: 3}),
			email: ko.observable().extend({required: true, email: true, minLength: 3}),
			password: ko.observable().extend({required: true, minLength: 3}),

			/**
			 * Activate our model, this method is always called
			 */
			activate: function() {
				// If session active, go home
				User.isLoggedIn(function(isLoggedIn) {
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
					User.tryCreateUser(this.username(), this.email(), this.password(), 
						function(createResult) {
							if(createResult) {
								// Yay!	
								app.showMessage('User created successfully, please log in', '').then(function() {
									router.navigate('user/login');
								});
							}
							else {
								// Error, show a message
								app.showMessage('Could not create your account. Please try again', '');
							}
						});
				}
			}
    }
  });
