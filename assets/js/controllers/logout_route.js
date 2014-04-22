define(function (require) {
    var session = require('controllers/session'),
        app = require('durandal/app');

    return {
        activate: function () {

            session.unset();
            app.go2('');
        }
    };
});
