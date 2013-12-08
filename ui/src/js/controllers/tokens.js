define([
	"controllers/dom",
	"controllers/requests"
], function (dom, requests) {

	var tokens = {

		showList: function () {

			var req = requests.get("/api/tokens");

			req.done(function (data) {
				dom.loadTokens(data);
			});

			req.fail(function () {
				dom.showError("Could not load tokens");
			});
		}

	};

	return tokens;

});
