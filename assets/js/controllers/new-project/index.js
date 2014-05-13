define([
  'durandal/app',
  'plugins/router',
  'knockout',
	'models/user'
], function (app, router, ko, user) {
	var router = router.createChildRouter()
				.map([
					{ route: 'new/source', moduleId: 'controllers/new-project/choose-source', title: 'Choose Project Source', nav: true},
					{ route: 'new/repo/:source', moduleId: 'controllers/new-project/choose-repo', title: 'Choose Project Repository', nav: true},
					{ route: 'new/type', moduleId: 'controllers/new-project/choose-type', title: 'Choose Project Type', nav: true}

				]).buildNavigationModel();

  return {
    router: router,

		newVar: 'foo',

		/**
		 * Activate our model, this method is always called
		 */
		activate: function() {
			// If session active, go home
			user.isLoggedIn(function(isLoggedIn) {
				if(isLoggedIn === false) {
					alert(isLoggedIn);
					//router.navigate('user/login');
				}
			});
		},
  };
});

