define([
	"controllers/dom",
	"controllers/requests",
	"controllers/router"
], function (dom, requests, Router) {

	var router = new Router();

	var tokens = {

		showList: function () {

			var self = this,
				req = requests.get("/api/tokens/");

			req.done(function (data) {
				dom.loadTokens(data, self);
			});

			req.fail(function () {
				dom.showError("Could not load tokens");
			});
		},

		addToken: function (data) {
			var token = data[0].value,
				req = requests.put("/api/token/", {
					token: token
				});

			req.done(function () {
				router.reload();
				dom.showSuccess("Token successfully added");
			});

			req.fail(function () {
				dom.showError("Could not add token");
			});
		},

		deleteToken: function (token) {
			var req = requests.delete("/api/token/" + token);

			req.done(function () {
				router.reload();
				dom.showSuccess("Token successfully deleted");
			});

			req.fail(function () {
				dom.showError("Could not delete token");
			});
		}

	};

	return tokens;

});
