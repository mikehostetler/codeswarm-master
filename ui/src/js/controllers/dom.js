define([
    "jquery",
    "handlebars",
    "text!templates/header.tpl",
    "text!templates/login.tpl",
    "text!templates/menu.tpl",
    "text!templates/projects.tpl",
    "text!templates/logs.tpl"
],
function ($, Handlebars, header, login, menu, projects, logs) {
   
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
            } else {
                this.$menu.removeClass("menu-open");
                this.$shadowblock = this.$header.find("#shadow-block");
                this.$shadowblock.removeClass("menu-open");
            }
            this.$shadowblock = this.$header.find("#shadow-block");
        },
        
        /**
         * Load the menu contents
         */
        loadMenu: function () {
            var template = Handlebars.compile(menu),
                html = template({});
            this.$menu.html(html);
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
            this.loadHeader(true);
            this.loadMenu();
        },
        
        /**
         * Load projects
         */
        loadProjects: function (data) {
            var template = Handlebars.compile(projects),
                html = template({ projects: data });
            this.$main.html(html);
        },
        
        /**
         * Load logs
         */
        loadLogs: function (project, data) {
            var template = Handlebars.compile(logs),
                html = template({ project: project, logs: data });
            this.$main.html(html);
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
            self.$notification.addClass(type).children("div").text(message);
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
        
        // Proxy for showNotifcation
        showError: function (message) {
            this.showNotification("error", message);
        },
        
        // Proxy for showNotification
        showSuccess: function (message) {
            this.showNotification("success", message);
        }
    };
    
    Handlebars.registerHelper("compare", function(lvalue, rvalue, options) {

        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper compare needs 2 parameters");
        }
    
        var operator = options.hash.operator || "==";
    
        var operators = {
            "===":      function(l,r) { return l === r; },
            "!==":      function(l,r) { return l !== r; },
            "<":        function(l,r) { return l < r; },
            ">":        function(l,r) { return l > r; },
            "<=":       function(l,r) { return l <= r; },
            ">=":       function(l,r) { return l >= r; },
            "typeof":   function(l,r) { return typeof l === r; }
        };
    
        if (!operators[operator]) {
            throw new Error("Handlerbars Helper compare does not know the operator "+operator);
        }
    
        var result = operators[operator](lvalue,rvalue);
    
        if( result ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    
    });
    
    Handlebars.registerHelper("key_value", function(obj, options) {
        var buffer = "",
            key;
     
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                buffer += options.fn({key: key, value: obj[key]});
            }
        }
     
        return buffer;
    });
   
    return dom;
    
});