define([
  'durandal/app',
  'plugins/router',
  'knockout',
	'models/user',
	'gravatar',
], function (app, router, ko, User) {
	var childRouter = router.createChildRouter()
				.map([
					{ route: 'user/login', moduleId: 'controllers/user/login', title: 'Log into CodeSwarm', nav: true},
					{ route: 'user/forgot-password', moduleId: 'controllers/user/forgot-password', title: 'Forgot Password', nav: true},
					{ route: 'user/logout', moduleId: 'controllers/user/logout'},
					{ route: 'user/register', moduleId: 'controllers/user/register', title: 'Create a new Account', nav: true},
					{ route: 'user/account', moduleId: 'controllers/user/account', title: '', nav: true}

				]).buildNavigationModel();

  return {
    router: childRouter
  };
});

