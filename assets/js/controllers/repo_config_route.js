define(function (require) {
    var projects = require('controllers/projects'),
        auth = require('auth');

    return {
        activate: function (owner, repo) {

            var project;

            project = owner + '/' + repo;
            auth.authenticated(function () {
                projects.configProject(project);
            });
        }
    };
});
