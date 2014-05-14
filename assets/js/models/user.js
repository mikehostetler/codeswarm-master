define(['amplify'],function(require) {
	amplify.request.define('user','sails',{
		url: '/user',
		dataType: 'json',
		type: 'GET'
	});

	amplify.request.define('user.get','sails',{
		url: '/user/{username}',
		dataType: 'json',
		type: 'GET'
	});

	amplify.request.define('user.create','sails',{
		url: '/auth/local/register',
		dataType: 'json',
		type: 'POST'
	});

	amplify.request.define('user.save','sails',{
		url: '/user/{username}',
		dataType: 'json',
		type: 'PUT'
	});

	/* Including this here for clarity, this has intentionally been disabled server-side
	amplify.request.define('user.delete','sails',{
		url: '/user/{username}',
		dataType: 'json',
		type: 'DELETE'
	});
	*/

	amplify.request.define('user.login','sails',{
		url: '/auth/local',
		dataType: 'json',
		type: 'POST'
	});

	amplify.request.define('user.logout','sails',{
		url: '/logout',
		dataType: 'json',
		type: 'GET'
	});

	var User = amplify.model.extend({
		/**
		 * Instance Methods
		 */
		defaults: {
			username: '',
			email: 'email@email.com'
		},
		initialize: function(){
			//alert("I've initialized a User Model!");
		},
		customMethod: function(){
			//alert("Calling User.customMethod");
		}
	},{
		// Public Methods
		isLoggedIn: function(cb) {
			var loggedIn = amplify.store.sessionStorage('loggedIn');

			// Refresh the session for good measure
			amplify.request({
				resourceId: 'user',
				success: function(data) {
					// Set local session
					amplify.store.sessionStorage('loggedIn',true);
					amplify.store.localStorage('user',data.user);
					amplify.publish('user.loggedIn',true);
					if(cb) cb(true);
				},
				error: function() {
					// Clear local session
					amplify.store.sessionStorage('loggedIn',false);
					amplify.store.localStorage('user',{});
					amplify.publish('user.loggedIn',false);
					if(cb) cb(false);
				}
			});
		},
		tryCreateUser: function(username, email, password, cb) {
			amplify.request({
				resourceId: 'user.create',
				data: {
					'username': username,
					'email': email,
					'password': password
				},
				success: function(data) {
					amplify.store.localStorage('user',data.user);
					cb(true);
				},
				error: function(data) {
					cb(false);
				}
			});
		},
		tryLogin: function(username, password, cb) {
			amplify.request({
				resourceId: 'user.login',
				data: {
					'identifier': username,
					'password': password
				},
				success: function(data) {
					// Store the credentials
					amplify.store.sessionStorage('loggedIn',true);
					amplify.store.localStorage('user',data.user);
					amplify.publish('user.loggedIn',true);
					cb(true);
				},
				error: function(data) {
					// Clear local session
					amplify.store.sessionStorage('cs_sid','');
					amplify.publish('user.loggedIn',false);
					cb(false);
				}
			});
		},
		tryLogout: function(cb) {
			amplify.request({
				resourceId: 'user.logout',
				success: function(data) {
					amplify.store.sessionStorage('loggedIn',false);
					amplify.store.localStorage('user',{});
					amplify.publish('user.loggedIn',false);
					if(cb) cb();
				},
				error: function(data) {
					amplify.store.sessionStorage('cs_sid','');
					amplify.publish('user.loggedIn',false);
					amplify.publish('user.loggedIn',false);
					if(cb) cb();
				}
			});
		}
	});

	return User;
});
