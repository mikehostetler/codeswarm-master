define([
  'plugins/router',
  'durandal/app',
  'dom',
  'jquery',
  'session',
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
        {
          route: '',
          moduleId: 'controllers/home/index',
          title: 'Welcome',
          nav: true
        }, {
          route: 'about',
          moduleId: 'controllers/home/about',
          title: 'About CodeSwarm',
          nav: true
        }, {
          route: 'support',
          moduleId: 'controllers/home/support',
          title: 'Getting Support',
          nav: true
        }, {
          route: 'contribute',
          moduleId: 'controllers/home/contribute',
          title: 'Contribute',
          nav: true
        },

        // Search
        {
          route: 'search/*term',
          moduleId: 'controllers/home/search',
          title: 'Search',
          nav: true
        },

        // User Management
        {
          route: 'user',
          moduleId: 'controllers/user/index',
          title: 'User Profile',
          nav: true
        }, {
          route: 'user/login',
          moduleId: 'controllers/user/login',
          title: 'Login',
          nav: true
        }, {
          route: 'user/logout',
          moduleId: 'controllers/user/logout',
          title: 'Logout',
          nav: true
        }, {
          route: 'user/forgot',
          moduleId: 'controllers/user/forgot-password',
          nav: true
        }, {
          route: 'recover-password/:secret',
          moduleId: 'controllers/user/recover-password',
          nav: true
        }, {
          route: 'user/signup',
          moduleId: 'controllers/user/signup',
          title: 'Signup',
          nav: true
        }, {
          route: 'user/settings',
          moduleId: 'controllers/user/settings',
          title: 'User Settings',
          nav: true
        },

        // Orgs
        {
          route: 'new-project',
          moduleId: 'controllers/org/config',
          title: 'New Project',
          nav: true
        }, {
          route: ':org',
          moduleId: 'controllers/org/index',
          title: 'Projects List',
          nav: true
        }, {
          route: ':org/:repo',
          moduleId: 'controllers/org/project',
          title: 'Project View',
          nav: true
        }, {
          route: ':org/:repo/config',
          moduleId: 'controllers/org/config',
          title: 'Project Config',
          nav: true
        }, {
          route: ':org/:repo/:build',
          moduleId: 'controllers/org/build',
          title: 'Project Build',
          nav: true
        }

      ]).buildNavigationModel();

      return router.activate();

    },
    compositionComplete: function () {
      // On composition, run dom controller activation
      dom.activate();
    }
  };

});
