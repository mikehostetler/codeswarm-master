define([
  'plugins/router',
	'durandal/system'
], function (router, system) {

  // Client side maintenance of user session information
  var session = {

    start: function (data) {
      // Set localStorage JSON
      localStorage.setItem('session', JSON.stringify(data));

      // Send to home
			router.navigate('');	
    },

    data: function () {
      // Return parsed object from localStorage
			system.log("Session",localStorage.getItem('session'));
      return JSON.parse(localStorage.getItem('session'));
    },

		isLoggedIn: function () {
			var session = this.data();
			if(session !== null) {
				return true;
			}
			return false;
		},

    end: function () {
      // Clear localStorage
      localStorage.removeItem('session');
			system.log("Logged Out",localStorage.getItem('session'));

      // Return to login screen
			router.navigate('user/login');	
    }

  };

  return session;


});
