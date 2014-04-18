define([
  'controllers/timestamp'],
  function (timestamp) {

  var build = {
    forShow: function(build) {
      build.created_at = timestamp(build.started_at);
      if (build.stages) {
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
      }

      if (!build.ended) build.status = 'pending';
      else build.status = build.success ? 'passed' : 'failed';

      return build;
    }
  };

  return build;

});