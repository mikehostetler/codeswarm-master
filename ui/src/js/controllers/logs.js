define([
	"controllers/dom",
	"controllers/requests"
], function (dom, requests) {

	var logs = {

		showList: function (project) {
			var self = this,
				req = requests.get("/api/logs/" + project);

			req.done(function (data) {
				function reverseForIn(obj, f) {
					var arr = [];
					for (var key in obj) {
						arr.push(key);
					}
					for (var i = arr.length - 1; i >= 0; i--) {
						f.call(obj, arr[i]);
					}
				}
				var output = {};
				// Build formatted, reversed output
				reverseForIn(data, function (key) {
					output[key] = {
						date: self.formatTimestamp(parseInt(key, 10)),
						status: this[key],
						project: project
					};
				});
				dom.loadLogs(project, output);
			});

			req.fail(function () {
				dom.showError("Could not load logs");
			});
		},

		showLog: function (project, log) {
			var self = this,
				req = requests.get("/api/log/" + project + "/" + log);

			req.done(function (data) {
				dom.loadLogOutput(project, log, self.formatTimestamp(log), data);
			});

			req.fail(function () {
				dom.showError("Could not load log file");
			});
		},

		formatTimestamp: function (timestamp) {
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
			if (parts.hour >= 12) {
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
		}

	};

	return logs;

});
