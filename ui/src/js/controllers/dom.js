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
        
        $window: null,
        $header: null,
        $menu: null,
        $menubutton: null,
        $shadowblock: null,
        $main: null,
        
        init: function () {
            
            // Cache elements
            this.$window = $(window);
            this.$header = $("header");
            this.$menu = $("aside");
            this.$shadowblock = this.$header.find("#shadow-block");
            this.$main = $("#main");
            
            // Initialize methods
            this.loadHeader();
            this.floatHeader();
            
        },
        
        /**
         * Load the header contents
         */
        loadHeader: function (auth) {
            this.$header.html(Handlebars.compile(header, { auth: auth }));
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
                console.log("clicked");
                self.$menu.toggleClass("menu-open");
                self.$shadowblock.toggleClass("menu-open");
            });
        }
    };
   
    return dom;
    
});