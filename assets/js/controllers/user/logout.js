define([
	'durandal/app',
  'plugins/router',
  'utils/session'
], function (app, router, session) {

	amplify.request('user.logout');

	router.navigate('/');
	
  return {};
});
