define([
  'durandal/app',
  'plugins/router',
  'utils/dom',
  'utils/session',
  'jquery',
  'knockout',
  'gravatar',
  'transitions/entrance',
], function (app, router, dom, session, $, ko, gravatar) {
  return {
    gravatarUrl: ko.observable('http://www.gravatar.com/avatar/00000000000000000000000000000000'),
    fullName: ko.observable(),
    loggedIn: ko.observable(false),
    router: router,
    activate: function () {

      // Handle header checks
      router.on('router:navigation:complete', function () {
        session.data(function (err, data) {
          if (err) {
            this.loggedIn(false);
          } else {
            var gUrl = gravatar(data.email, 50);
            this.fullName(data.fname + ' ' + data.lname);
            this.gravatarUrl(gUrl);
            this.loggedIn(true);
          }
        });
      });

      // Map routes
      router.map([
        // Static Routes
        { route: '', moduleId: 'controllers/home/index', title: 'Welcome' }
      ]);

      return router.activate();
    },
    compositionComplete: function () {
      // On composition, run dom controller activation
      //dom.activate();
    }
  };

});
