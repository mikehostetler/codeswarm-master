define([
	'durandal/app',
  'plugins/router',
  'utils/session',
	'models/user'
], function (app, router, session) {

	var user = require('models/user');
	user.tryLogout();

	router.navigate('/');
	
  return {};
});
