define([
	"controllers/dom",
	"controllers/requests",
	"controllers/timestamp"
], function (dom, requests, timestamp) {
	var builds;

	builds = {

		list: function (project) {
			var req = requests.get("/projects/" + project + '/builds');

			req.done(function (data) {
				var output = {};

				function reverseForIn(obj, f) {
					var arr = [],
						key,
						i;
					for (key in obj) {
						arr.push(key);
					}
					for (i = arr.length - 1; i >= 0; i--) {
						f.call(obj, arr[i]);
					}
				}
				// Build formatted, reversed output
				reverseForIn(data, function (key) {
					output[key] = {
						date: timestamp(parseInt(key, 10)),
						status: this[key],
						project: project
					};
				});
				dom.loadBuilds(project, output);
			});

			req.fail(function () {
				dom.showError("Could not load builds");
			});
		},

		show: function (project, log) {
			var req = requests.get("/projects/" + project + "/builds/" + log);

			req.done(function (data) {
				dom.loadLogOutput(project, log, timestamp(parseInt(log, 10)), data);
			});

			req.fail(function () {
				dom.showError("Could not load log file");
			});
		}

	};

	return builds;

});
