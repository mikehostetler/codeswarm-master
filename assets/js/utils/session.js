define([
  'plugins/router'
], function (router) {

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
      return JSON.parse(localStorage.getItem('session'));
    },

    end: function () {
      // Clear localStorage
      localStorage.removeItem('session');

      // Return to login screen
			router.navigate('user/login');	
    }

  };

  return session;


});
