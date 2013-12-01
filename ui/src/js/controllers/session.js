define([
    "controllers/dom",
    "controllers/requests",
    "controllers/router"
], function (dom, requests, Router) {
    
    var session = {
        
        get: function () {
            if (localStorage.getItem("session")) {
                return JSON.parse(localStorage.getItem("session"));
            } else {
                return false;
            }
        },
        
        set: function (data) {
            localStorage.setItem("session", JSON.stringify(data));
        },
        
        getLogin: function () {
            
            var self = this,
                router = new Router();
            
            $(dom.login).on("submit", function (e) {
                e.preventDefault();
                var $this = $(this),
                    token = dom.getValue($this, "token"),
                    req = requests.get("/api/token/"+token);
                    
                req.done(function (session) {
                    self.set(session);
                    router.go("/projects");
                });
                
                req.fail(function (xhr) {
                    dom.showError(xhr.responseText);
                });
            });
        }
    };
    
    return session;
    
});