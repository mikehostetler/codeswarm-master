define([
	"controllers/dom"
], function (dom) {

	var socket = io.connect(location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : ""));

	socket.on("build", function (data) {
		dom.updateStatus(data.project, data._id, data.status);
		dom.updateLog(data._id, data.log);
	});

});
