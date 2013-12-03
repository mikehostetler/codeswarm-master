/**
 * Require-router
 * Allows hash-based routing
 * ex:
 * --------------------------------------
 * var route = new Router();
 *
 * // Establish a route
 * route.on("/user/:id", function (id) {
 *     console.log("User ID: " + id);
 * });
 *
 * // Go to a route
 * route.go("/user/12345");
 */

define(function () {

    /**
     * Create router object
     */
    var Router = function () {
        var self = this;

        // Watch hashchange
        window.onhashchange = function () {
            self.process();
        };

        // Run on load
        window.onload = function () {
            self.process();
        };
    };

    /**
     * Container object for routes
     */
    Router.prototype.routes = {};

    /**
     * Processes/matches routes and fires callback
     */
    Router.prototype.process = function () {
        var self = this,
            fragment = window.location.hash.replace("#", ""),
            matcher,
            args = [];

        // Match root
        if (fragment === "/" || fragment === "" && self.routes.hasOwnProperty("/")) {
            self.routes["/"].apply(this);
        } else {
            // Match routes    
            for (var route in self.routes) {
                matcher = fragment.match(new RegExp(route.replace(/:[^\s/]+/g, "([\\w-]+)")));
                if (matcher !== null && route !== "/") {
                    // Get args
                    if (matcher.length > 1) {
                        for (var i = 1, z = matcher.length; i < z; i++) {
                            args.push(matcher[i]);
                        }
                    }
                    self.routes[route].apply(this, args);
                }
            }
        }

    };

    /**
     * Method for binding route to callback
     */
    Router.prototype.on = function (path, cb) {
        this.routes[path] = cb;
    };

    /**
     * Method for programatically navigating to route
     */
    Router.prototype.go = function (path) {
        var location = window.location,
            root = location.pathname.replace(/[^\/]$/, "$&"),
            url,
            self = this;

        // Handle url composition
        if (path.length) {
            // Fragment exists
            url = root + location.search + "#" + path;
        } else {
            // Null/Blank fragment, nav to root
            url = root + location.search;
        }

        if (history.pushState) {
            // Browser supports pushState()
            history.pushState(null, document.title, url);
            self.process();
        } else {
            // Older browser fallback
            location.replace(root + url);
            self.process();
        }
    };

    return Router;

});
