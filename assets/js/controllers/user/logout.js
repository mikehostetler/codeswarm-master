define([
  'session'
], function (session) {
  var ctor = {

    // Set displayName
    displayName: 'Log Out',

    canActivate: function () {
      // Ends session, returns to login screen
      session.end();
      return true;
    }

  };

  return ctor;

});
