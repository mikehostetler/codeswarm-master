define([
  'knockout',
  'request'
], function(ko, request) {

    var ctor = {

        // Set displayName
        displayName: 'About CodeSwarm',

        // Initialization
        activate: function (context) {

        },

        // Define model
        SOMEPROPERTY: ko.observable(),

        // Define request
        someReq: {
          url: '/ENDPOINT',
          type: 'GET'
        },

        trySomeReq: function () {
          // Set payload
          var payload = {

          };
          // Make Request
          var req = request(this.someReq, payload);

          // On success
          req.done(function (data) {

          });

          // On failure
          req.fail(function (err) {

          });
        }

    };


    return ctor;
});
