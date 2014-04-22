define([
  'plugins/router',
  'durandal/app',
  'utils/dom',
  'utils/session',
  'jquery',
  'knockout',
  'gravatar',
  'transitions/entrance',
], function (router, app, dom, $, session, ko, gravatar) {
  return {
    gravatarUrl: ko.observable('http://www.gravatar.com/avatar/00000000000000000000000000000000'),
    fullName: ko.observable(),
    loggedIn: ko.observable(false),
    router: router,
    activate: function () {

      var self = this;
      // Handle header checks
      router.on('router:navigation:complete', function () {
        session.data(function (err, data) {
          if (err) {
            self.loggedIn(false);
          } else {
            var gUrl = gravatar(data.email, 50);
            self.fullName(data.fname + ' ' + data.lname);
            self.gravatarUrl(gUrl);
            self.loggedIn(true);
          }
        });
      });

      // Map routes
      router.map([
        // Static Routes
        { route: '', moduleId: 'controllers/home/index', title: 'Welcome', nav: true }
      ]).buildNavigationModel();

      return router.activate();
    },
    compositionComplete: function () {
      // On composition, run dom controller activation
      dom.activate();
    }
  };

});
