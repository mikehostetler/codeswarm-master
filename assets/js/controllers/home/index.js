define([
    'models/user',
    'models/projects',
    'utils/session',
    'knockout'
  ],

  function (user, projects, session, ko) {

  return {

			/**
			 * local viewmodel properties
			 */

            displayName: 'Welcome',
            isLoggedIn: ko.observable(),

            projects: ko.observableArray([]),
 
			/**
			 * Activate our model, this method is always called
			 */
            activate: function () {
                user.isLoggedIn(
                        function (res) {
                            this.isLoggedIn(res);
                        }.bind(this));

                amplify.subscribe('projects', this, function (stuff) {
                    this.projects.push.apply(this.projects, stuff);
                });

                projects.getAllProjects();
            },
        };

});
