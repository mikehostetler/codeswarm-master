define([
	'utils/dom',
	'utils/requests',
	'durandal/app',
	'utils/error',
	'utils/users'
], function (dom, requests, app, error, users) {
	var session;

	session = {

		get: function () {

			var session = localStorage.getItem("session");
			if (session) {
				try {
					session = JSON.parse(session);
				} catch (e) {
					session = {};
				}

			}
			return session;
		},

		set: function (data) {
			localStorage.setItem('session', JSON.stringify(data));
		},

		unset: function () {
			localStorage.removeItem('session');
			users.clearCurrent();
		},

		check: function(cb) {
			requests.get('/session').

                done(function(sess) {
                    session.set(sess.session);
                    cb(null, sess.session);
                }).

                fail(function(xhr) {
                    cb(xhr.responseJSON || (new Error('Failed')));
                });
        },

		getLogin: function () {

			var self = this;

			$(dom.login).on('submit', function (e) {
				e.preventDefault();
				var $this = $(this),
					email		 = dom.getValue($this, "email"),
					password = dom.getValue($this, "password");

				requests.post("/sessions", {
					email: email,
					password: password
				}).done(function (response) {
						self.set(response.session);
						users.setCurrent(response.user);
						if (localStorage.getItem("route")) {
							// User has saved route, pass them there
							router.go(localStorage.getItem("route"));
							localStorage.removeItem("route");
						} else {
							// "Fresh" login, send to projects list
							router.go("/projects");
						}
					}).fail(dom.showXhrError);
			});
		},

		getACL: function (fn) {
			// Ensure session is set
			var token = this.get(),
				req;

			if (token) {
				req = requests.get('/api/token/' + token);
				req.done(
                    function (projects) {
                        if (fn && typeof fn === 'function') {
                            fn(projects);
                        }
                    });

				req.fail(dom.showXhrError);
			}
		}
	};

	return session;
});
