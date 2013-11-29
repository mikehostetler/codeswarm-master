define([
    "jquery"
],
function ($) {
   
    var effects = {
        
        $window: null,
        $header: null,
        
        init: function () {
            
            // Cache elements
            this.$window = $(window);
            this.$header = $("header");
            
            // Initialize methods
            this.floatHeader();
            
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
        }
           
    };
   
    return effects;
    
});