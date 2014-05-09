/*
define(function (require) {
    var session = require('controllers/session'),
        dom = require('controllers/dom'),
        app = require('durandal/app');

    return {
        activate: function () {

            if (!session.get()) {
                dom.loadLogin();
                dom.setBodyClass('login');
                session.getLogin();
            } else {
                app.go2('projects', true);
            }
        }
    };
});
*/
