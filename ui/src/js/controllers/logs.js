define([
    "controllers/dom",
    "controllers/requests"
], function (dom, requests) {
    
    var logs = {
    
        showList: function (project) {
            var req = requests.get("/api/logs/"+project);
            
            req.done(function (data) {
                console.log(data);
                dom.loadLogs(project, data);
            });
            
            req.fail(function (xhr) {
                dom.showError(xhr.responseTest);
            });
        }
    
    };
    
    return logs;
    
});