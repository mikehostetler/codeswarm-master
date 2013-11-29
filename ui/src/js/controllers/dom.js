define([
    "jquery"
],
function ($) {
   
    var dom = {
        
        $window: null,
        $header: null,
        $menu: null,
        $menubutton: null,
        $shadowblock: null,
        
        init: function () {
            
            // Cache elements
            this.$window = $(window);
            this.$header = $("header");
            this.$menu = $("aside");
            this.$menubutton = this.$header.find(".menu-button");
            this.$shadowblock = this.$header.find("#shadow-block");
            
            // Initialize methods
            this.floatHeader();
            this.bindMenu();
            
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
            self.$menubutton.on("click", function () {
                self.$menu.toggleClass("menu-open");
                self.$shadowblock.toggleClass("menu-open");
            });
        }
    };
   
    return dom;
    
});