define([
	"controllers/dom",
	"controllers/requests",
	"controllers/timestamp",
	"controllers/socket",
	"ansi_up"
], function (dom, requests, timestamp, socket, ansi_up) {
	var builds;

	builds = {

		list: function (project) {
			var req = requests.get("/projects/" + project + '/builds');

			req.done(function (builds) {
				var output = [];

				builds.sort(sortByDesc('created_at'));

				builds.forEach(function (build) {
					if (build.started_at) build.started_at = timestamp(build.started_at);
					if (build.ended_at) build.ended_at = timestamp(build.ended_at);
				});

				socket.addBuilds(project, builds);

				dom.loadBuilds(project, builds);
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

function sortByDesc(prop) {
	return function(a, b) {
		return b[prop] - a[prop];
	}
}