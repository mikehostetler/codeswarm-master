var projects = require('../../db/projects');

module.exports = deploy;

function deploy(req, res) {
  // Get project
  var id = req.params.owner + '/' + req.params.repo;
  var user = req.session.userCtx.name;

  projects.get(id, replied);

  function replied(err, project) {
    if (err) res.send(err.status_code || 500, err);
    else if (! project) res.send(404, new Error('Not found'));
    else {
      if (project.public || project.owners.indexOf(user) >= 0)
        res.send(project);
      else res.send(404, new Error('Not found'));
    }
  }

  // Ensure the project has been config'd
  if (!config.projects.hasOwnProperty(project)) {
    // Nope, send an error
    res.send("ERROR: Configuration.");
  } else {
    // Set build
    var build = config.projects[project],
      stamp = new Date().getTime(),
      post = req.body,
      run = false,
      payload, ref, branch;

    // Check trigger condition and branch match
    if (!post.hasOwnProperty("payload")) {
      // Manual trigger
      run = true;
    } else {
      payload = JSON.parse(post.payload);
      // Check to ensure branch match
      if (payload.hasOwnProperty("ref")) {
        //console.log(post);
        ref = payload.ref.split("/");
        branch = ref[ref.length - 1];
        if (branch === build.branch) {
          run = true;
        }
      }
    }

    if (run) {

      // Set state object
      build.state = {};
      // Set ID
      build.state.id = stamp;
      // Set current working directory
      build.state.cwd = stamp;
      // Set log URL
      build.state.logURL = req.protocol + "://" + req.get("host") + "/#/logs/" + build.dir + "/" + stamp;
      // Set name
      build.state.name = project + ", Build " + stamp;
      // Set log
      build.state.log = config.app.logs + build.dir + "/" + stamp + ".log";
      // Set status
      build.state.status = "processing";
      // Send deploy response
      res.send({
        build: build.state.id
      });
      // Run build
      builder(build);

    }
  }

}