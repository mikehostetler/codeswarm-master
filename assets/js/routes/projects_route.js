define(function (require) {
    var projects = require('controllers/projects'),
        dom = require('controllers/dom'),
        auth = require('auth');

    return {
        activate: function () {

            auth.authenticated(function () {
                projects.showList();
                dom.setBodyClass('project-list');
            });
        }
    };
});
