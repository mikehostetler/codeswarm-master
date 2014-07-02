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
                }
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
        } else {
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
        }, function(err){
            console.log("there was an error checking if the user is logged in: ", err);
        });
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
    this.createUser = function (userobject) {
        usSpinnerService.spin('theSpinner');
        return connector("/auth/local/register").register(userobject).$promise.then(function (data) {
            console.log("NEW USER CREATED: ", data);
            usSpinnerService.stop('theSpinner');
            localStorageService.set("user", data.user);
        }, function (err) {
            console.log("ERROR CREATING USER: ", err);
        });
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

    this.getProject = function (projectId) {
        return connector('/:project').read({project: projectId}).getProject.$promise.then(function (data) {
            return data;
        });
    };

    this.deployProject = function (projectId) {
        return connector('/:project/deploy').read({project: projectId}).deployProject.$promise;
    };

    this.editProject = function (projectId, branch) {
        return connector("/:project").read({project: projectId}).editProject({
            'branch': branch
        }).$promise;
    };

    this.deleteProject = function (projectId) {
        return connector('/:project').read({project: projectId}).deleteProject.$promise;
    };

    this.getProjectBuilds = function (projectId) {
        return connector('/:project/builds').read({project: projectId}).getBuilds.$promise.then(function (data) {
            return data;
        });
    };

    this.getProjectBuilds = function (projectId, buildId) {
        return connector('/:project/build/:build').read({project: projectId, build: buildId}).getSingleBuild.$promise.then(function (data) {
            return data;
        });
    };

    return this;
}]);
