define([
  'durandal/app',
  'plugins/router',
  'knockout',
	'models/user',
	'gravatar',
], function (app, router, ko, user) {

  return {
		/**
		 * local viewmodel properties
		 */
		// Needed to set up the routes below
    router: router,

    isLoggedIn: ko.observable(false),
    gravatarUrl: ko.observable('http://www.gravatar.com/avatar/00000000000000000000000000000000'),
    username: ko.observable(),
    email: ko.observable(),

		/**
		 * Activate our model, this method is always called
		 */
    activate: function () {
			// Check whether we are logged in
			user.isLoggedIn();

			// Set up our subscription when the loggedIn state changes
			amplify.subscribe('user.loggedIn',this,function(isLoggedIn) {
				if(isLoggedIn) {
					var user = amplify.store.localStorage('user');
					this.username(user.username);
					this.email(user.email);
					if(user.email) this.gravatarUrl(gravatar(user.email,{size: 32}));
					this.isLoggedIn(true);
					
					// Client-Side Binding
					this.globalNav();
					this.globalSearch();
				}
				else {
					this.isLoggedIn(false);
				}
			});

      // Check our session
      router.on('router:navigation:complete', function () {
				// Check the login state each route change
				//user.isLoggedIn();
      });

      // Map routes
      return router.map([
        // Static Routes
        { route: '', moduleId: 'controllers/home/index', title: 'Welcome', nav: true},

        { route: 'user/login', moduleId: 'controllers/user/login', title: 'Log into CodeSwarm', nav: true},
        { route: 'user/forgot-password', moduleId: 'controllers/user/forgot-password', title: 'Forgot Password', nav: true},
        { route: 'user/logout', moduleId: 'controllers/user/logout'},
        { route: 'user/register', moduleId: 'controllers/user/register', title: 'Create a new Account', nav: true},
        { route: 'user/account', moduleId: 'controllers/user/account', title: '', nav: true}

      ]).buildNavigationModel()
				//.mapUnknownRoutes('site/not-found','not-found')
				.activate();
    },

    compositionComplete: function () {
      // On composition, run dom controller activation
			this.floatHeader();
			this.globalNav();
			this.globalSearch();
		},
		floatHeader: function () {
			$(window).scroll(function () {
				if ($(this).scrollTop() > 0) {
					$('header').addClass('floating');
				} else {
					$('header').removeClass('floating');
				}
			});
		},

		globalNav: function() {
			var $nav = $('.profile-nav'),
					navOpen = 'profile-nav--open';

			$(document).on('click', '.profile-nav--trigger', function (e) {
				e.stopPropagation();
				e.preventDefault();

				if (!$nav.hasClass(navOpen)) {
					$nav.addClass(navOpen);
				} else {
					$nav.removeClass(navOpen);
				}
			});

			$(document).on('click', function () {
				$nav.removeClass(navOpen);
			}).on('click', '.profile-nav--list', function (e) {
				e.stopPropagation();
			});

			$('.global-search--trigger, .profile-nav a').on('click', function () {
				$nav.removeClass(navOpen);
			});
    },
		globalSearch: function () {
			var self = this,
					$searchTrigger = $('.global-search--trigger'),
					$search = $('.global-search'),
					searchOpen = 'global-search--open',
					searchTriggerOpen = 'global-search--trigger--open';

			$searchTrigger.click(function (e) {
				e.stopPropagation();
				e.preventDefault();

				if (!$search.hasClass(searchOpen)) {
					$search.addClass(searchOpen);
					$(this).addClass(searchTriggerOpen);
				} else {
					$search.removeClass(searchOpen);
					$(this).removeClass(searchTriggerOpen);
				}
			});

			$(document)
			.on('click', function () {
				$search.removeClass(searchOpen);
				$searchTrigger.removeClass(searchTriggerOpen);
			})
			.on('click', '.global-search', function (e) {
				e.stopPropagation();
			});

			$('.profile-nav--trigger').on('click', function () {
				$search.removeClass(searchOpen);
				$searchTrigger.removeClass(searchTriggerOpen);
			});
		},
  };

});
