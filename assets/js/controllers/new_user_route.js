define(function (require) {
    var dom = require('controllers/dom'),
        users = require('controllers/users');

    return {
        activate: function () {
            dom.loadSignup();
            dom.setBodyClass('signup');
            users.getSignup();
        }
    };
});
