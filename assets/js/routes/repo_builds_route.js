define(function (require) {
    var builds = require('controllers/builds'),
        dom = require('controllers/dom'),
        auth = require('auth');

    return {
        activate: function (owner, repo) {

            var project;

            project = owner + '/' + repo;
            auth.authenticated(function () {
                builds.list(project);
                dom.setBodyClass('project-logs');
            });
        }
    };
});
