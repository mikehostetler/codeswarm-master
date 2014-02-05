define([
	"controllers/dom",
	"controllers/requests",
	"controllers/timestamp"
], function (dom, requests, timestamp) {
	var builds;

	builds = {

		list: function (project) {
			var req = requests.get("/projects/" + project + '/builds');

			req.done(function (builds) {
				var output = [];

				// Build formatted, reversed output
				var output = builds.map(function (build) {
					return {
						id: build._id,
						date: timestamp(build.started_at),
						status: build.state,
						project: build.project
					};
				});
				dom.loadBuilds(project, output);
			});

			req.fail(function () {
				dom.showError("Could not load builds");
			});
		},

		show: function (project, build) {
			var req = requests.get("/projects/" + project + "/builds/" + build);

			req.done(function (build) {
				console.log('BUILD 3:', build);
				build.created_at = timestamp(build.started_at);
				build.stages.forEach(function(stage) {
					stage.commands.forEach(function(command) {
						command.args = command.args.join(' ');
					});
				});
				dom.loadLogOutput(project, build);
			});

			req.fail(function () {
				dom.showError("Could not load log file");
			});
		}

	};

	return builds;

});


