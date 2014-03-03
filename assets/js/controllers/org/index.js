define([
  'knockout',
  'request',
  'dom'
], function(ko, request, dom) {

    var ctor = {

        // Set displayName
        displayName: 'About CodeSwarm',

        // Initialization
        activator: function (context) {

        },

        // Define model
        SOMEPROPERTY: ko.observable(),

        // Define request
        projectsReq: {
          url: '/projects',
          type: 'GET'
        },

        tryGetProjects: function () {
          // Set payload
          var payload = {};
          // Make Request
          var req = request(this.projectsReq, payload);

          // On success
          req.done(function (data) {
            console.log(data);
          });

          // On failure
          req.fail(function (err) {
            dom.showNotification('error', JSON.parse(err.responseText).message);
          });
        }

    };


    return ctor;
});
