define([
    'durandal/app',
    'plugins/router',
    'knockout',
		'utils/session',
		'ko.validate'
  ],

  function (app, router, ko, session) {


  return {

		activate: function() {
			// If session active, goto profile
			amplify.request('user.session',function(data) {
				console.log("User Session?", data);
			});
		},

		// Set displayName
		displayName: 'Login',

      // Setup model
      email: ko.observable().extend({required: true}),
      password: ko.observable().extend({required: true}),

      // Login handler method
      btnLogin_Click: function () {
				amplify.request({
					resourceId: 'user.login',
					data: {
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
						app.showMessage('Invalid Username or Password', '');
					}
				});
      }
    }
  });
