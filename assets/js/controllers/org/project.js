define([
  'knockout',
  'request',
  'dom'
], function (ko, request, dom) {

  var ctor = {

    // Set displayName
    displayName: 'Project',

    // Initialization
    activator: function (org, repo) {
      this.param_org = org;
      this.param_repo = repo;
    },

    // Define model
    title: ko.observable(),
    repo: ko.observable(),
    sha: ko.observable(),
    branch: ko.observable(),

    // Define get request
    getProjectRequest: {
      url: function () {
        return '/projects/' + ctor.param_org + '/' + ctor.param_repo;
      },
      type: 'GET'
    },

    // Get project
    tryGetProject: function () {
      var self = this;

      // Make Request
      var req = request(this.getProjectRequest);

      // On success
      req.done(function (data) {
        console.log(data);
        // Loop through data response
        for (var prop in data) {
          // Assing model attr value with returned val
          self[prop](data[prop]);
        }
      });

      // On failure
      req.fail(function (err) {
        dom.showNotification('error', JSON.parse(err.responseText).message);
      });
    },

  };

  return ctor;
});
