define([
    "controllers/dom",
    "controllers/requests"
], function (dom, requests) {
    
    var projects = {
    
        showList: function () {
            
            var req = requests.get("/api/projects");
            
            req.done(function (data) {
                dom.loadProjects(data);
            });
            
            req.fail(function (xhr) {
                dom.showError(xhr.responseTest);
            });
        }
    
    };
    
    return projects;
    
});