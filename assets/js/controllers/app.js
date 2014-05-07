define([
  'durandal/app',
  'plugins/router',
  'utils/dom',
  'utils/session',
  'jquery',
  'knockout',
	'gravatar',
	'amplify'
], function (app, router, dom, session, $, ko) {

  return {
    router: router,

    gravatarUrl: ko.observable('http://www.gravatar.com/avatar/00000000000000000000000000000000'),
    fullName: ko.observable(),
    isLoggedIn: ko.observable(false),

    activate: function () {

			// Set up our subscription when the loggedIn state changes
			amplify.subscribe('user.loggedIn',this,function(isLoggedIn) {
				if(isLoggedIn) {
					var user = amplify.store.localStorage('user');
					this.fullName(user.name);
					this.gravatarUrl(gravatar('mike@appendto.com',{size: 32}));
					this.isLoggedIn(true);
					return true;
				}
				this.isLoggedIn(false);
				return false;
			});


      // Check our session
      router.on('router:navigation:complete', function () {
				amplify.request({
					resourceId: 'user.session',
					data: {},
					success: function(data) {
            amplify.publish('user.loggedIn',true);
					},
					error: function(data) {
            amplify.publish('user.loggedIn',false);
					}
        });
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
				.mapUnknownRoutes('site/not-found','not-found')
				.activate();
    },

    compositionComplete: function () {
      // On composition, run dom controller activation
    }
  };

});
