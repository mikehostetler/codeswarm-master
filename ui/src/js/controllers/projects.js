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

            req.fail(function () {
                dom.showError("Could not load projects");
            });
        }

    };

    return projects;

});
