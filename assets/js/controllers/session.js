define([
	"controllers/dom",
	"controllers/requests",
	"controllers/router"
], function (dom, requests, Router, error) {
	var session;

	session = {

		get: function () {
			var session = localStorage.getItem("session");
			if (session) session = JSON.parse(session);
			return session;
		},

		set: function (data) {
			localStorage.setItem("session", JSON.stringify(data));
		},

		unset: function () {
			localStorage.removeItem("session");
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

			var self = this,
				router = new Router();

			$(dom.login).on("submit", function (e) {
				e.preventDefault();
				var $this = $(this),
					username = dom.getValue($this, "username"),
					password = dom.getValue($this, "password"),
					req = requests.post("/sessions", {
						username: username,
						password: password
					});

				req.done(function (response) {
					self.set(response.session);
					if (localStorage.getItem("route")) {
						// User has saved route, pass them there
						router.go(localStorage.getItem("route"));
						localStorage.removeItem("route");
					} else {
						// "Fresh" login, send to projects list
						router.go("/projects");
					}
				});

				req.fail(dom.showXhrError);
			});
		},

		getACL: function (fn) {
			// Ensure session is set
			var token = this.get(),
				req;
			if (token) {
				req = requests.get("/api/token/" + token);
				req.done(function (projects) {
					if (fn && typeof fn === "function") {
						fn(projects);
					}
				});
				req.fail(dom.showXhrError);
			}
		}
	};

	return session;

});
