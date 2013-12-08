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
			var token = data[0].value;
			console.log(token);
		}

	};

	return tokens;

});
