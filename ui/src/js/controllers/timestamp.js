define(function () {
	var timestamp;

	timestamp = function (timestamp) {
		var format = "{{month}}/{{day}}/{{year}} at {{hour}}:{{minute}}{{ampm}}",
			date = new Date(timestamp),
			parts = {
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				day: date.getDate(),
				hour: date.getHours(),
				minute: date.getMinutes(),
				second: date.getSeconds(),
				ampm: "am"
			},

			formatRender = function (i, match) {
				return parts[match];
			};

		// Set AM/PM time format
		if (parts.hour > 12) {
			parts.hour -= 12;
			parts.ampm = "pm";
		}

		// Ensure min and sec in 2-digit
		if (parts.minute < 10) {
			parts.minute = "0" + parts.minute;
		}

		if (parts.second < 10) {
			parts.second = "0" + parts.second;
		}

		return format.replace(/\{\{([^}]+)\}\}/g, formatRender);
	};

	return timestamp;

});
