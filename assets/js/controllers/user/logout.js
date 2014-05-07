define([
	'durandal/app',
  'plugins/router',
	'models/user'
], function (app, router, user) {

  return {
		/**
		 * local viewmodel properties
		 */
		
		/**
		 * Activate our model, this method is always called
		 */
		activate: function() {
			// Log out and go home
			user.tryLogout(function() {
				router.navigate('/');
			});
		}
	};
});
