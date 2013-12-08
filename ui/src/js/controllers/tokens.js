define([
	"controllers/dom",
	"controllers/requests"
], function (dom, requests) {

	var tokens = {

		showList: function () {

			var self = this,
				req = requests.get("/api/tokens");

			req.done(function (data) {
				dom.loadTokens(data, self);
			});

			req.fail(function () {
				dom.showError("Could not load tokens");
			});
		},

		addToken: function (data) {
			var token = data[0].value,
				req = requests.put("/api/token", {
					token: token
				});

			req.done(function () {
				alert("Added!");
			});

			req.fail(function () {
				dom.showError("Could not add token");
			});
		},

		deleteToken: function (token) {
			var req = requests.delete("/api/token/" + token);

			req.done(function () {
				alert("Deleted!");
			});

			req.fail(function () {
				dom.showError("Could not delete token");
			});
		}

	};

	return tokens;

});
