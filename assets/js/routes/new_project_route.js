define(function (require) {
    var projects = require('controllers/projects'),
        auth = require('auth');

    return {
        activate: function () {

            auth.authenticated(function () {
                projects.newProject();
            });
        }
    };
});
