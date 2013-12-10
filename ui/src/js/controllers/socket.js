define([
	"controllers/dom"
], function (dom) {

	var socket = io.connect(location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : ""));

	socket.on("build", function (data) {
		console.log(data);
	});

});
