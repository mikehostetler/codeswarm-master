define([
    "controllers/dom",
    "controllers/session"
], function (dom, session) {
    
    var app = {
        
        init: function () {
            dom.init();
            this.checkSession();
        },
        
        checkSession: function () {
            if (session.get()) {
                dom.loadApp();
            } else {
                dom.loadLogin();
            }
        }
    
    };
    
    return app;
    
});