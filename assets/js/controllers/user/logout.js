define([
	'durandal/app',
  'plugins/router',
	'models/user'
], function (app, router, User) {

  return {
		/**
		 * local viewmodel properties
		 */
		
		/**
		 * Activate our model, this method is always called
		 */
		activate: function() {
			// Log out and go home
			User.tryLogout(function() {
				router.navigate('/');
			});
		}
	};
});
