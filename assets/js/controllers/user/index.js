define([
  'durandal/app',
  'plugins/router',
  'knockout',
	'models/user',
	'gravatar',
], function (app, router, ko, user) {

	var childRouter = router.createChildRouter()
			.makeRelative({
				}).map([
					{ route: 'login', moduleId: 'controllers/user/login', title: 'Log into CodeSwarm', nav: true},
					{ route: 'forgot-password', moduleId: 'controllers/user/forgot-password', title: 'Forgot Password', nav: true},
					{ route: 'logout', moduleId: 'controllers/user/logout'},
					{ route: 'register', moduleId: 'controllers/user/register', title: 'Create a new Account', nav: true},
					{ route: 'account', moduleId: 'controllers/user/account', title: '', nav: true}

				]).buildNavigationModel();

  return {
    router: childRouter
  };
});

