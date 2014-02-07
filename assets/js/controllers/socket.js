define([
	"controllers/dom",
  "controllers/timestamp"
], function (dom, timestamp) {

	var socket = io.connect(location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : ""));

  window.socket = socket;

  socket.on('update', onProjectUpdate);
  socket.on('build', onBuild);

  var projects = {};
  var project, builds;

  return {
    addProject: addProject,
    addBuilds: addBuilds,
    reset: reset
  };

  function addProject(project) {
    projects[project._id] = project;
    socket.emit('join project', project._id);
  }

  function addBuilds(_project, _builds) {
    builds = _builds;
    project = _project;
    socket.emit('join builds', project);
  }

  function reset() {
    for(var project in projects)
      socket.emit('leave project', project);
    projects = {};

    for(var project in builds)
      socket.emit('leave builds', project);
    builds = [];
    project = undefined;
  }

  function onProjectUpdate(projectName, attribute, val) {
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

    /// TODO: normalize at the model layer, not here
    if (typeof project.started_at == 'number')
      project.started_at = timestamp(project.started_at);
    if (typeof project.ended_at == 'number')
      project.ended_at = timestamp(project.ended_at);

    dom.updateProject(project);
  }

  function onBuild(build) {
    var i, found;
    if (build.project != project) return;

    for(i = 0 ; i < builds.length; i ++) {
      if (builds[i]._id == build._id) {
        found = builds[i];
        break;
      }
    }
    if (found) builds[i] = build;
    else builds.unshift(build);

    if (build.started_at) build.started_at = timestamp(build.started_at);
    if (build.ended_at) build.ended_at = timestamp(build.ended_at);

    dom.loadBuilds(project, builds);
  }

});
