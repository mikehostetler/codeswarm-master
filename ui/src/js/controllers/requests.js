define([
	"jquery"
], function ($) {

	var requests = {

		get: function (url) {
			var get = $.ajax({
				type: "GET",
				url: url
			});

			return get;
		},

		put: function (url, payload) {
			return $.ajax({
				type: "PUT",
				url: url,
				data: payload
			});
		},

		post: function (url, payload) {
			return $.ajax({
				type: "POST",
				url: url,
				data: payload
			});
		},

		delete: function (url) {
			return $.ajax({
				type: "DELETE",
				url: url
			});
		}
	};

	return requests;

});
