define([
	'amplify'
], function () {

/*
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
		type: 'GET'
	});

	amplify.request.define('user.session.end','ajax',{
		url: '/session',
		type: 'DELETE'
	});
	*/

  // Client side maintenance of user session information
	/*
  var session = {

    data: function (cb) {
      // Return session info
      var req = request({
        url: '/user',
      });

      // Success
      req.done(function (data) {
        if (cb && typeof cb === 'function') {
          cb(false, data);
        }
      });

      // Session fail / DNE
      req.fail(function (err) {
        if (cb && typeof cb === 'function') {
          cb(true, err);
        }
      });
    },

    isLoggedIn: function (cb) {
      this.data(function (err, data) {
        if (err) {
          cb(false);
        } else {
          cb(true);
        }
      });
    },

    end: function () {
      var req = request({
        url: '/session',
        type: 'DELETE'
      });

      req.done(function () {
        router.navigate('user/login');
      });

      req.fail(function () {
        router.navigate('user/login');
      });
    }

  };

  return session;
	*/
});
