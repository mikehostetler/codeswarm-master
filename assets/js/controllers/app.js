define([
  'durandal/app',
  'plugins/router',
  'knockout',
	'models/user',
	'gravatar',
], function (app, router, ko, user) {

  return {
		/**
		 * local viewmodel properties
		 */
		// Needed to set up the routes below
    router: router,

    isLoggedIn: ko.observable(false),
    gravatarUrl: ko.observable('http://www.gravatar.com/avatar/00000000000000000000000000000000'),
    username: ko.observable(),
    email: ko.observable(),

		/**
		 * Activate our model, this method is always called
		 */
    activate: function () {
			// Check whether we are logged in
			user.isLoggedIn();

			// Set up our subscription when the loggedIn state changes
			amplify.subscribe('user.loggedIn',this,function(isLoggedIn) {
				if(isLoggedIn) {
					var user = amplify.store.localStorage('user');
					this.username(user.username);
					this.email(user.email);
					if(user.email) this.gravatarUrl(gravatar(user.email,{size: 32}));
					this.isLoggedIn(true);
				}
				else {
					this.isLoggedIn(false);
				}
			});

      // Check our session
      router.on('router:navigation:complete', function () {
				// Check the login state each route change
				//user.isLoggedIn();
      });

      // Map routes
      return router.map([
        // Static Routes
        { route: '', moduleId: 'controllers/home/index', title: 'Welcome', nav: true},

        { route: 'user/login', moduleId: 'controllers/user/login', title: 'Log into CodeSwarm', nav: true},
        { route: 'user/forgot-password', moduleId: 'controllers/user/forgot-password', title: 'Forgot Password', nav: true},
        { route: 'user/logout', moduleId: 'controllers/user/logout'},
        { route: 'user/register', moduleId: 'controllers/user/register', title: 'Create a new Account', nav: true},
        { route: 'user/account', moduleId: 'controllers/user/account', title: '', nav: true}

      ]).buildNavigationModel()
				//.mapUnknownRoutes('site/not-found','not-found')
				.activate();
    },

    compositionComplete: function () {
      // On composition, run dom controller activation
    }
  };

});
