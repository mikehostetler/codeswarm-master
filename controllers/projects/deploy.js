var builder  = require('../../lib/builder');

module.exports = deploy;

function deploy(req, res) {

  var project = req.project;

  // Set build
  var build = project;
  var stamp = new Date().getTime();
  var post = req.body;
  var run = false;
  var payload, ref, branch;

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
      run = branch === project.branch;
    }
  }

  if (run) {

    // Set state object
    build.state = {
      // Set ID
      id:     stamp,
      // Set current working directory
      cwd:    stamp,
      // Set log URL
      logURL: req.protocol + "://" + req.get("host") + "/#/logs/" + build.dir + "/" + stamp,
      // Set name
      name:   project + ", Build " + stamp,
      // Set log
      log:    config.app.logs + build.dir + "/" + stamp + ".log",
      // Set status
      status: "processing"

    };

    console.log('build:', build);

    // Send deploy response
    res.send({
      build: stamp
    });
    // Run build
    builder(build);
  }

}