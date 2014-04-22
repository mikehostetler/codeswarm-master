define([
  'session',
  'plugins/router'
], function (session, router) {
  var ctor = {
    // Check that user is logged in
    canActivate: function () {
      session.isLoggedIn(function (sess) {
        if (!sess) {
          router.navigate('/user/login');
        }
      });
      // This is required for Durandal
      return true;
    }
  };

  return ctor;
});
