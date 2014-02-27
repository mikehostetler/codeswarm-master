define(function () {

  // Client side maintenance of user session information
  var session = {

    start: function (data) {
      // Set localStorage JSON
      localStorage.setItem('session', JSON.stringify(data));
      // Send to home
      location.href = '/';
    },

    data: function () {
      // Return parsed object from localStorage
      return JSON.parse(localStorage.getItem('session'));
    },

    end: function () {
      // Clear localStorage
      localStorage.removeItem('session');
      // Return to login screen
      location.href = '/user/login';
    }

  };

  return session;


});