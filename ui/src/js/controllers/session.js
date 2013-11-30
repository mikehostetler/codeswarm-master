define([
    "controllers/dom",
    "controllers/requests"
], function (dom, requests) {
    
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
            
            var self = this;
            
            $(dom.login).on("submit", function (e) {
                e.preventDefault();
                var $this = $(this),
                    token = dom.getValue($this, "token"),
                    req = requests.get("/api/token/"+token);
                    
                req.done(function (session) {
                    self.set(session);
                    dom.loadApp();
                });
                
                req.fail(function (xhr, err) {
                    console.log(err);
                });
            });
        }
    };
    
    return session;
    
});