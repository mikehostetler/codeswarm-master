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
                }
            });
    }


    this.login = function (user, pass) {
        return connector("/auth/local").login({identifier: user, password: pass}).$promise;
    };

    this.logout = function () {
        connector("/logout").logout().$promise.then(function (data) {
            console.log("Logout Returned: ", data);
            localStorageService.remove("userdata");
        });
    };

    this.loggedin = function () {
        usSpinnerService.spin('theSpinner');
        connector("/user").user().$promise.finally(function (data) {
            typeof data == 'undefined' ? data = false : data = data;
            usSpinnerService.stop('theSpinner');

            console.log("checked with endpoint, result: ", data);
            if (!data) {
                localStorageService.remove("userdata");

                console.log("setting logged in to false");
            } else {
                console.log("USER DATA: ", data);
                console.log("setting logged in to true");
                localStorageService.set("user", data);
            }

        })
    };

    this.isloggedin = function ($scope) {
        if (!localStorageService.get("userdata")) {
            this.loggedin();
            return false;
        }else{
            console.log("didn't run check");
            return true;
        }

    }

    this.userExists = function (username) {
        connector("/user/:action").read({action: username}).$promise.then(function (data) {
            console.log("DATA FROM AUTH LOCAL: ", data);
            localStorageService.set("authlocal", data);
            return true;
        });
    };

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

    return this;


}]);