define([
    'knockout',
    'durandal/app',
    'plugins/router',
		'models/user'
  ],

  function (ko, app, router) {

		var user = require('models/user');

    return {
			activate: function() {
				// If session active, goto home
				if(user.isLoggedIn()) {
					router.navigate('/');
				}
			},

      // Set displayName
      displayName: 'Register',

      // Setup model
      username: ko.observable(),
      email: ko.observable(),
      password: ko.observable(),

			frmRegister_Submit: function() {
				// TODO - Validate login!

				// Ok, we are validated
				amplify.request({
					resourceId: 'user.create',
					data: {
						'username': this.username(),
						'email': this.email(),
						'password': this.password()
					},
					success: function(data) {
						// Store the credentials
						amplify.store.localStorage('user',data.user);
						amplify.publish('user.loggedIn',true);
						router.navigate('/');
					},
					error: function(data) {
						amplify.publish('user.loggedIn',false);
						app.showMessage('Could not register you!', '');
					}
				});
				
			}
    }
  });
