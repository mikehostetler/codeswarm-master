define([
	"controllers/dom",
	"controllers/requests",
	"controllers/timestamp",
	"ansi_up"
], function (dom, requests, timestamp, ansi_up) {
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
				build.created_at = timestamp(build.started_at);
				if (build.stages)
					build.stages.forEach(function(stage) {
						stage.commands.forEach(function(command) {
							command.args = command.args.join(' ');

							/// command output ANSI to HTML
							command.out = command.out.
							  split('\n').
							  map(ansi_up.ansi_to_html).
							  map(decorateLine).
							  join('');

							 command.finished_at = timestamp(command.finished_at);
						});
					});
				build.status = build.success ? 'passed' : 'failed';
				dom.loadLogOutput(project, build);
			});

			req.fail(function () {
				dom.showError("Could not load log file");
			});
		}

	};

	return builds;

});



function decorateLine(line) {
	return '<p>' + line + '</p>';
}