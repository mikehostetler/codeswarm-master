define([
  'session',
  'jquery'
], function (session, $) {

  var dom = {

    activate: function () {
      // Cache elements
      this.$window = $(window);
      this.$document = $(document);
      this.$header = $('header');
      this.$notification = $('#notification');

      // Start core dom handlers
      this.globalNav();
      this.globalSearch();
      this.floatHeader();
      this.accordion();
      this.sidebarSwitcher();
    },

    // Load header based on session auth
    loadHeader: function () {
      session.data(function (err, data) {
        if (err) {
          console.log('NOPE');
        } else {
          console.log('YEP! ', data);
        }
      });
    },

    // Show notification modal
    // type = error, success
    showNotification: function (type, message) {
      var self = this;
      self.$notification.addClass(type).children('div').html(message);
      // Auto-close after timeout
      var closer = setTimeout(function () {
        self.$notification.removeClass(type);
      }, 3000);
      // Bind close button
      self.$notification.find('a').click(function () {
        self.$notification.removeClass(type);
        window.clearTimeout(closer);
      });
    },

    // Control global header
    globalNav: function () {
      var self = this,
        $nav = $('.profile-nav'),
        navOpen = 'profile-nav--open';

      this.$document.on('click', '.profile-nav--trigger', function (e) {
        e.stopPropagation();
        e.preventDefault();

        if (!$nav.hasClass(navOpen)) {
          $nav.addClass(navOpen);
        } else {
          $nav.removeClass(navOpen);
        }
      });

      self.$document.on('click', function () {
        $nav.removeClass(navOpen);
      }).on('click', '.profile-nav--list', function (e) {
        e.stopPropagation();
      });

      $('.global-search--trigger, .profile-nav a').on('click', function () {
        $nav.removeClass(navOpen);
      });
    },

    // Initializes floating header
    floatHeader: function () {
      var self = this;
      self.$window.scroll(function () {
        if ($(this).scrollTop() > 0) {
          self.$header.addClass('floating');
        } else {
          self.$header.removeClass('floating');
        }
      });
    },

    // Hanlde global search
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

      self.$document
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

    // Handle accordions
    accordion: function () {
      $(document).on('click', '.build-groups-contain .sidebar-list li .accordion--trigger', function (e) {
        var $this = $(this);

        e.preventDefault();

        if (!$this.parent('li').hasClass('accordion--open')) {
          $this.parent('li').addClass('accordion--open');
        } else {
          $this.parent('li').removeClass('accordion--open');
        }
      });
    },

    // Switch views through sidebar
    // Switch view via sidebar
    sidebarSwitcher: function () {
      $('.sidebar-list li').on('click', 'a', function () {
        var type = $(this).data('link');
        $('.sidebar-list--active').removeClass();
        $('.show-' + type).parent('li').addClass('sidebar-list--active');
        $('section.view').hide();
        $('section.view-' + type).show();
      });
    },

  };

  return dom;

});
