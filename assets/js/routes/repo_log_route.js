define(function (require) {
    var builds = require('controllers/builds'),
        dom = require('controllers/dom'),
        auth = require('auth');

    return {
        activate: function (owner, repo, log) {

            var project;

            project = owner + '/' + repo;
            auth.authenticated(function () {
                builds.show(project, log);
                dom.setBodyClass('view-log');
            });
        }
    };
});
