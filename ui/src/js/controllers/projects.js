define([
    "controllers/dom",
    "controllers/requests"
], function (dom, requests) {
    
    var projects = {
    
        getList: function (fn) {
            
            var req = requests.get("/api/projects");
            
            req.done(function (data) {
                fn(data);
            });
            
            req.fail(function (xhr) {
                dom.showError(xhr.responseTest);
            });
        }
    
    };
    
    return projects;
    
});