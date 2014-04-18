define([
    'controllers/dom',
    'plugins/router',
    'controllers/session'
], function (dom, router, session) {

    var error = {
        handleXhrError: handleXhrError,
        xhrToCallback: xhrToCallback
    };

    return error;

    function handleXhrError(xhr) {
        if (proceedAfterXhr(xhr)) {
            dom.showXhrError(xhr);
        }
    }

    function xhrToCallback(cb) {

        return function(xhr) {

            if (proceedAfterXhr(xhr)) {
                var message = xhr.responseJSON && xhr.responseJSON.message ||
                xhr.responseText ||
                'Unknown error';

                var err = new Error(message);
                err.status = xhr.status;

                cb(err);
            }
        };
    }

    function proceedAfterXhr(xhr) {
        if (xhr.status === 401 && session) {
            session.unset();
            dom.showError('User is not logged in. <a href="#/">Log in</a>.');
            return false;
        }
        return true;
    }

});
