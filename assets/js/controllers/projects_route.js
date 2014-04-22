define(function (require) {
    var projects = require('controllers/projects'),
        dom = require('controllers/dom'),
        auth = require('controllers/auth');

    return {
        activate: function () {

            auth.authenticated(function () {
                projects.showList();
                dom.setBodyClass('project-list');
            });
        }
    };
});
