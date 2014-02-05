define([
	"controllers/dom"
], function (dom) {

	var socket = io.connect(location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : ""));

  window.socket = socket;

  socket.on('update', onUpdate);

  var projects = {};

  return {
    addProject: addProject,
    reset: reset
  };

  function addProject(project) {
    projects[project._id] = project;
    socket.emit('join project', project._id);
  }

  function reset() {
    for(var project in projects)
      socket.emit('leave project', project);
    projects = {};
  }

  function onUpdate(projectName, attribute, val) {
    var project = projects[projectName];
    if (! project) return;

    var value = project;

    var attrs = attribute.split('.');
    while(attrs.length > 1) {
      var attr = attrs.unshift();
      if (value.hasOwnProperty(attr))
        value = value[attr];
      else return;
    }

    var attr = attrs[0];
    if (attr) {
      value[attr] = val;
    } else return;

    dom.updateProject(project);
  }

});
