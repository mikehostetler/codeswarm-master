define([
  'session'
], function (session) {
  var ctor = {

    // Set displayName
    displayName: 'Log Out',

    activate: function () {
      // Ends session, returns to login screen
      session.end();
    }

  };

  return ctor;

});
