define([
	"controllers/dom"
], function (dom) {

	var socket = io.connect(location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : ""));

	socket.on("build", function (build) {
    console.log('BUILD:', build);
		dom.updateStatus(build.project, build._id, build.status);
		dom.updateLog(build._id, build.log);
	});

});
