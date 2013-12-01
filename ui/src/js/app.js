define([
    "controllers/dom",
    "controllers/session",
    "controllers/router",
    "controllers/projects"
], function (dom, session, Router, projects) {
    
    var app = {
        
        init: function () {
            // Start DOM controller
            dom.init();
            
            // Routing
            var router = new Router();
            
            router.on("/", function () {
                if (!session.get()) {
                    dom.loadLogin();
                    session.getLogin();
                } else {
                    router.go("/projects");
                }
            });
            
            router.on("/projects", function () {
                if (!session.get()) {
                    router.go("/");
                } else {
                    dom.loadApp();
                    projects.getList();
                }
            });
            
            // Kick off process
            router.process();
            
        }
    
    };
    
    return app;
    
});