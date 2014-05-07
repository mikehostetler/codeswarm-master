define(['amplify'],function(require) {
	amplify.request.define('user','ajax',{
		url: '/user',
		type: 'GET'
	});

	amplify.request.define('user.create','ajax',{
		url: '/user',
		type: 'POST'
	});

	amplify.request.define('user.login','ajax',{
		url: '/session',
		type: 'POST'
	});

	amplify.request.define('user.session','ajax',{
		url: '/session',
		type: 'GET',
		cache: "sessionStorage"
	});

	amplify.request.define('user.session.end','ajax',{
		url: '/session',
		type: 'DELETE'
	});

	return {
		// Public Methods
		isLoggedIn: function() {

			// Refresh the session for good measure
			amplify.request({
				resourceId: 'user.session',
				success: function(data) {
					// Set local session
					amplify.store.sessionStorage('cs_sid',data.session);
					amplify.publish('user.loggedIn',true);
				},
				error: function() {
					// Clear local session
					amplify.store.sessionStorage('cs_sid',null);
					amplify.publish('user.loggedIn',false);
				}
			});
			
			var sid = amplify.store.sessionStorage('cs_sid');
			if(sid !== null) {
				return true;
			}
			else {
				return false;
			}
		},
		tryLogin: function(username, password) {
			amplify.request({
				resourceId: 'user.login',
				data: {
					'username': username,
					'password': password
				},
				success: function(data) {
					// Store the credentials
					amplify.store.sessionStorage('cs_sid',data.session);
					amplify.store.localStorage('user',data.user);

					amplify.publish('user.loggedIn',true);
					return true;
				},
				error: function(data) {
					// Clear local session
					amplify.store.sessionStorage('cs_sid','');
					amplify.publish('user.loggedIn',false);
					return false;
				}
			});
		},
		tryLogout: function(username, password) {
			amplify.request('user.session.end');
			amplify.store.sessionStorage('cs_sid','');
			amplify.publish('user.loggedIn',false);
		}
	};
});
