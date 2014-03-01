define([
	"jquery"
], function ($) {

	var requests = {

		get: function (url) {
			var get = $.ajax({
				type: "GET",
				url: url,
				dataType: 'json'
			});

			return get;
		},

		put: function (url, payload) {
			return $.ajax({
				type: "PUT",
				url: url,
				data: payload,
				dataType: 'json'
			});
		},

		post: function (url, payload) {
			return $.ajax({
				type: "POST",
				url: url,
				data: payload,
				dataType: 'json'
			});
		},

		delete: function (url) {
			return $.ajax({
				type: "DELETE",
				url: url,
				dataType: 'json'
			});
		}
	};

	return requests;

});
