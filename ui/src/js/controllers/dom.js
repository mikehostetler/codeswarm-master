define([
    "jquery",
    "handlebars",
    "text!templates/header.tpl",
    "text!templates/login.tpl",
    "text!templates/menu.tpl",
    "text!templates/projects.tpl"
],
function ($, Handlebars, header, login, menu, projects) {
   
    var dom = {
        
        // Cached els
        $window: null,
        $header: null,
        $menu: null,
        $menubutton: null,
        $shadowblock: null,
        $main: null,
        $notification: null,
        
        // Named els
        login: "#login",
        
        init: function () {
            
            // Cache elements
            this.$window = $(window);
            this.$header = $("header");
            this.$menu = $("aside");
            this.$shadowblock = this.$header.find("#shadow-block");
            this.$main = $("#main");
            this.$notification = $("#notification");
            
            // Initialize methods
            this.loadHeader();
            this.floatHeader();
            
        },
        
        /**
         * Load the header contents
         */
        loadHeader: function (auth) {
            var template = Handlebars.compile(header),
                html = template({auth: auth});
            this.$header.html(html);
            if (auth) {
                this.bindMenu();
            }
        },
        
        /**
         * Load the menu contents
         */
        loadMenu: function () {
            this.$menu.html(Handlebars.compile(menu));
        },
        
        /**
         * Load the login form
         */
        loadLogin: function () {
            this.$main
                .html(login)
                .find("input:first-of-type")
                .focus();
            this.loadHeader(false);
        },
        
        /**
         * Get input from form element by name
         */
        getValue: function (form, name) {
            return form.find("[name=\""+name+"\"]").val();
        },
        
        /**
         * Load the app
         */
        loadApp: function () {
            this.$main
                .html(projects);
            this.loadHeader(true);
        },
        
        /**
         * Applies floating property to fixed header
         */
        floatHeader: function () {
            
            var self = this;
            
            self.$window.scroll(function() {
                if ($(this).scrollTop() > 0) {
                    self.$header.addClass("floating");
                } else {
                    self.$header.removeClass("floating");
                }
            });
        },
        
        /**
         * Opens and closes menu
         */
        bindMenu: function () {
            var self = this;
            self.$header.off().on("click", ".menu-button", function () {
                self.$menu.toggleClass("menu-open");
                self.$shadowblock.toggleClass("menu-open");
            });
        },
        
        /**
         * Shows notification pop-up
         */
        showNotification: function (type, message) {
            var self = this;
            self.$notification.addClass(type).children("div").html(message);
            // Auto-close after timeout
            var closer = setTimeout(function () {
                self.$notification.removeClass(type);
            }, 3000);
            // Bind close button
            self.$notification.find("a").click(function () {
                self.$notification.removeClass(type);
                window.clearTimeout(closer);
            });
        },
        
        showError: function (message) {
            this.showNotification("error", message);
        },
        
        showSuccess: function (message) {
            this.showNotification("success", message);
        }
    };
   
    return dom;
    
});