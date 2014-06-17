define([
  'durandal/app',
  'plugins/router',
  'knockout',
	'models/user',
	'models/projects'
], function (app, router, ko, User, Project) {
/*
	var childRouter = router.createChildRouter()
				.map([
					{ route: 'new/source', moduleId: 'controllers/new-project/choose-source', title: 'Choose Project Source', nav: true},
					{ route: 'new/repo/:source', moduleId: 'controllers/new-project/choose-repo', title: 'Choose Project Repository', nav: true},
					{ route: 'new/type', moduleId: 'controllers/new-project/choose-type', title: 'Choose Project Type', nav: true}

				]).buildNavigationModel();
				*/

  return {
    router: router,

		strRepository: ko.observable().extend({required: true}),
		strBranch: ko.observable().extend({required: true}),
		arrTypes: ko.observableArray(['node','browser','custom']),
		strChosenType: ko.observableArray(['']),
		blnPublic: ko.observable(false),

		/**
		 * Activate our model, this method is always called
		 */
		activate: function() {
			// If session active, go home
			User.isLoggedIn(function(isLoggedIn) {
				if(isLoggedIn === false) {
					router.navigate('user/login');
				}
			});
		},

		frmNewProject_Submit: function () {

			var currentUser = User.getCurrentUser(),
				newProject = new Project({
													repo: this.strRepository(),
													branch: this.strBranch(),
													public: (this.blnPublic == true?true:false),
													type: this.strChosenType(),
													owners: [currentUser.username]
												});

			newProject.save({ 
				success:function(result) {
					console.log('We got a result!',result);
				},
				error:function(err) {
					console.log('We got an error!',err);
				}
			});
		}
  };
});

