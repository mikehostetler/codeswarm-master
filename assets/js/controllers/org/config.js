define([
  'knockout',
  'request',
  'dom'
], function (ko, request, dom) {

  var ctor = {

    // Set displayName
    displayName: 'About CodeSwarm',

    // Initialization
    activate: function (org, repo) {
      // Set param props
      this.param_org = org;
      this.param_repo = repo;
      // If not new project, load data from endpoint
      if (repo!=='new-project') {
        this.tryGetProject();
      }
    },

    // Define model
    title: ko.observable(),
    repo: ko.observable(),
    sha: ko.observable(),
    branch: ko.observable(),

    // Define get request
    getProjectRequest: {
      url: '/projects/'+this.param_org+'/'+this.param_repo,
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

    // Define save project request
    saveProjectRequest: {
      url: '/projects/'+this.param_org+'/'+this.param_repo,
      type: 'PUT'
    },

    trySaveProject: function () {

      // Set payload
      var payload = {

      };

      // Make request
      var req = request(this.saveProjectRequest, payload);

      // On success
      req.done(function (data) {
        dom.showNotification('success', 'Project successfully saved');
      });

      // On failure
      req.fail(function (err) {
        dom.showNotification('error', JSON.parse(err.responseText).message);
      });
    }

  };

  return ctor;
});
