define([
    "controllers/dom"
], function (dom) {
    
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
            $(dom.login).on("submit", function (e) {
                e.preventDefault();
                var $this = $(this),
                    email = dom.getValue($this, "email"),
                    password = dom.getValue($this, "password");
                    
                console.log(email + " " + password);
            });
        }
    };
    
    return session;
    
});