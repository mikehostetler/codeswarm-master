define([
  'plugins/router',
  'durandal/app',
  'dom',
  'session',
  'knockout'
], function (router, app, dom, session, ko) {
  var ctor = {
    gravatarUrl: 'http://www.gravatar.com/avatar/00000000000000000000000000000000',
    fullName: 'Mike Hostetler',
    loggedIn: ko.observable(false),
    router: router,
    activate: function () {
      router.map([

        // Static Routes
        { route: '', moduleId: 'codeswarm/home/index', title: 'Welcome', nav: true },
        { route: 'about', moduleId: 'codeswarm/home/about', title: 'About CodeSwarm', nav: true },
        { route: 'support', moduleId: 'codeswarm/home/support', title: 'Getting Support', nav: true },
        { route: 'contribute', moduleId: 'codeswarm/home/contribute', title: 'Contribute', nav: true },

        // Search
        { route: 'search/*term', moduleId: 'codeswarm/home/search', title: 'Search', nav: true },

        // User Management
        { route: 'user', moduleId: 'codeswarm/user/index', title: 'User Profile', nav: true },
        { route: 'user/login', moduleId: 'codeswarm/user/login', title: 'Login', nav: true },
        { route: 'user/logout', moduleId: 'codeswarm/user/logout', title: 'Logout', nav: true },
        { route: 'user/forgot', moduleId: 'codeswarm/user/forgot-password', nav: true },
        { route: 'user/signup', moduleId: 'codeswarm/user/signup', title: 'Signup', nav: true },
        { route: 'user/settings', moduleId: 'codeswarm/user/settings', title: 'User Settings', nav: true },

        // Orgs
        { route: ':org', moduleId: 'codeswarm/org/index', nav: true },
        { route: ':org/:repo', moduleId: 'codeswarm/org/project', nav: true },
        { route: ':org/:repo/:build',	moduleId: 'codeswarm/org/build', nav: true },
        { route: ':org/:repo/config',	moduleId: 'codeswarm/org/config', nav: true },

      ]).buildNavigationModel();
    },
    compositionComplete: function () {
      // On composition, run dom controller activation
      dom.activate();
    }
  };

  return ctor;
});
