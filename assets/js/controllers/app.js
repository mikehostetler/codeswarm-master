define([
  'plugins/router',
  'durandal/app',
  'dom',
  'session',
  'knockout',
  'transitions/entrance'
], function (router, app, dom, session, ko) {
  return {
    gravatarUrl: 'http://www.gravatar.com/avatar/00000000000000000000000000000000',
    fullName: 'Mike Hostetler',
    loggedIn: ko.observable(false),
    router: router,
    activate: function () {
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
          route: ':org',
          moduleId: 'controllers/org/index',
          nav: true
        }, {
          route: ':org/:repo',
          moduleId: 'controllers/org/project',
          nav: true
        }, {
          route: ':org/:repo/config',
          moduleId: 'controllers/org/config',
          nav: true
        }, {
          route: ':org/:repo/:build',
          moduleId: 'controllers/org/build',
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
