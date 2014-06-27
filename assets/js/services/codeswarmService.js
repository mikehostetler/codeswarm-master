var css = angular.module('codeswarmService', ['ngResource', 'LocalStorageModule', 'angularSpinner']);

css.service('codeswarmService', ['$rootScope', '$resource', 'localStorageService', 'usSpinnerService', function ($rootScope, $resource, localStorageService, usSpinnerService) {
    //set the prefix for the urls
    var url_prefix = localStorageService.get('urlprefix');

    //setting up the $resource object with endpoint and methods

    //in some of these I return a promise and others i resolve here, the difference between the two is when i want the
    //calling function to be able to handle things like scope when its appropriate

    var user = $resource(url_prefix + "/:action", {action: "@action"});

    function connector(url) {
        return $resource(url_prefix + url,
            {action: "@action"}, {
                login: {
                    method: 'POST',
                    params: {}
                },
                logout: {
                    method: 'GET',
                    params: {}
                },
                read: {
                    method: 'GET',
                    params: {}
                },
                register: {
                    method: 'POST',
                    params: {}
                },
                user: {
                    method: 'GET',
                    params: {}
                },
                projects: {
                    method: 'GET',
                    params: {}
                },
                newproject: {
                    method: 'POST',
                    params: {}
                },
                getProject: {
                    method: 'GET',
                    params: {}
                },
                deployProject: {
                    method: 'GET',
                    params: {}
                },
                editProject: {
                    method: 'POST',
                    params: {}
                },
                deleteProject: {
                    method: 'POST',
                    params: {}
                },
                getBuilds: {
                    method: 'GET',
                    params: {}
                },
                getSingleBuild: {
                    method: 'GET',
                    params: {}
                },
            });
    }


		/**
		 * Log a user in against our local strategy
		 */
    this.login = function (user, pass) {
        return connector("/auth/local").login({identifier: user, password: pass}).$promise;
    };

		/**
		 * Log a user out
		 */
    this.logout = function () {
        connector("/logout").logout().$promise.then(function (data) {
            //console.log("Logout Returned: ", data);
            localStorageService.remove("userdata");
        });
    };

		/**
		 * Check local storage whether the user is logged in
		 */
    this.isloggedin = function ($scope) {
        if (!localStorageService.get("userdata")) {
            this.loggedin();
            return false;
        }else{
            console.log("didn't run check");
            return true;
        }
    }

		/**
		 * Ask the server whether the user is logged in
		 */
    this.loggedin = function () {
        usSpinnerService.spin('theSpinner');
        connector("/user").user().$promise.finally(function (data) {
            typeof data == 'undefined' ? data = false : data = data;
            usSpinnerService.stop('theSpinner');

            //console.log("checked with endpoint, result: ", data);
            if (!data) {
                localStorageService.remove("userdata");
                //console.log("setting logged in to false");
            } else {
                //console.log("USER DATA: ", data);
                //console.log("setting logged in to true");
                localStorageService.set("user", data);
            }
        })
    };

		/**
		 * Check whether the username exists
		 */
    this.userExists = function (username) {
        connector("/user/:action").read({action: username}).$promise.then(function (data) {
						// TODO - Check whether the user does not exist!
						// It will contain the string, 'Could not find User'

            console.log("DATA FROM AUTH LOCAL: ", data);
            localStorageService.set("authlocal", data);
            return true;
        });
    };

		/**
		 * Create a new user with the local strategy
		 */
    this.createUser = function (username, email, password) {
        return connector("/auth/local/register").register({
            'username': username,
            'email': email,
            'password': password
        }).$promise;
    };

    this.getCurrentUser = function () {
        return localStorageService.get("user").user.id;
    };

    this.newproject = function (newproject) {
        return connector("/projects").newproject(newproject).$promise;
    };

    this.tryGetAllProjects = function () {
        return connector("/projects").projects().$promise;
    };

		this.getProject = function(project-id) {
			return connector('/:project').read({project: project-id}).getProject.$promise.then(function(data) {
				return data;
			});
		};
		
		this.deployProject = function(project-id) {
			return connector('/:project/deploy').read({project: project-id}).deployProject.$promise;
		};

    this.editProject = function (project-id, branch) {
        return connector("/:project").read({project: project-id}).editProject({
            'branch': branch,
        }).$promise;
    };

		this.deleteProject = function(project-id) {
			return connector('/:project').read({project: project-id}).deleteProject.$promise;
		};

		this.getProjectBuilds = function(project-id) {
			return connector('/:project/builds').read({project: project-id}).getBuilds.$promise.then(function(data) {
				return data;
			});
		};

		this.getProjectBuilds = function(project-id,buildId) {
			return connector('/:project/build/:build').read({project: project-id, build: buildId}).getSingleBuild.$promise.then(function(data) {
				return data;
			});
		};

    return this;
}]);
