define(['plugins/router', 'controllers/session', 'controllers/dom'], function (router, session, dom) {

	var lastAuthenticatedBackendCheck,
        maxRecheckCacheMs = 1000 * 60;

    lastAuthenticatedBackendCheck = localStorage.getItem('lastCheck');

    function needsSessionRecheck() {
        return (!lastAuthenticatedBackendCheck ||
            Date.now() - lastAuthenticatedBackendCheck > maxRecheckCacheMs);
    }

    var retVal = {};

        //  Ensures authentication on routed tasks
    retVal.authenticated = function (fn) {
        if (!session.get()) {

            // Not logged in? Save state, Go home.
            localStorage.setItem('route', window.location.hash.replace('#', ''));
            router.navigate('/');
        } else {
            if (needsSessionRecheck()) {
                session.check(function(err, sid) {
                    if (err) {
                        dom.showError(err.message);
                    } else {
                        lastAuthenticatedBackendCheck = Date.now();
                        localStorage.setItem(
                            'lastCheck', lastAuthenticatedBackendCheck);
                        dom.loadApp();
                        fn.call();
                    }
                });
            } else if (typeof fn === 'function') {
                dom.loadApp();
                fn.call();
            }
        }
    };

    return retVal;
});

