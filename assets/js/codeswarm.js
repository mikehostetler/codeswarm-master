var codeswarm = angular.module("codeswarm", [
			'ngAnimate', 
			'ngRoute', 
			'ngResource', 
			'ngSanitize', 
			'LocalStorageModule', 
			'codeswarmService', 
			'angularSpinner'
		]).config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {

            $routeProvider.when("/", {templateUrl: '/js/templates/main.tpl', controller: "mainController"});
            $routeProvider.when("/home/", {templateUrl: '/js/templates/home/index.tpl', controller: "indexController"});
            $routeProvider.when("/home/about", {templateUrl: '/js/templates/home/about.tpl', controller: "aboutController"});
            $routeProvider.when("/home/search", {templateUrl: '/js/templates/home/search.tpl', controller: "searchController"});
            $routeProvider.when("/home/support", {templateUrl: '/js/templates/home/support.tpl', controller: "supportController"});

            $routeProvider.when("/new-project/", {templateUrl: '/js/templates/newproject/index.tpl', controller: "newprojectindexController"});
            $routeProvider.when("/new-project/chooserepo", {templateUrl: '/js/templates/newproject/chooserepo.tpl', controller: "chooserepoController"});
            $routeProvider.when("/new-project/choosesource", {templateUrl: '/js/templates/newproject/choosesource.tpl', controller: "choosesourceController"});
            $routeProvider.when("/new-project/choosetype", {templateUrl: '/js/templates/newproject/choosetype.tpl', controller: "choosetypeController"});

            $routeProvider.when("/org/build", {templateUrl: '/js/templates/org/build.tpl', controller: "buildController"});
            $routeProvider.when("/org/config", {templateUrl: '/js/templates/org/config.tpl', controller: "configController"});
            $routeProvider.when("/org/project", {templateUrl: '/js/templates/org/project.tpl', controller: "projectController"});
            $routeProvider.when("/org/", {templateUrl: '/js/templates/org/index.tpl', controller: "orgindexController"});

            $routeProvider.when("/user/login", {templateUrl: '/js/templates/user/login.tpl', controller: "loginController"});
            $routeProvider.when("/user/register", {templateUrl: '/js/templates/user/register.tpl', controller: "registerController"});
            $routeProvider.when("/user/logout", {templateUrl: '/js/templates/user/logout.tpl', controller: "logoutController"});
            $routeProvider.when("/user/forgotpassword", {templateUrl: '/js/templates/user/forgotpassword.tpl', controller: "forgotpasswordController"});
            $routeProvider.when("/user/account", {templateUrl: '/js/templates/user/account.tpl', controller: "accountController"});
            $routeProvider.when("/user/", {templateUrl: '/js/templates/user/index.tpl', controller: "orgindexController"});

            $routeProvider.otherwise("/", {templateUrl: '/js/templates/main.tpl', controller: "mainController"});

    }]).config(
			function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://localhost:1337/**',
            'http://codeswarm.by-a.ninja/**']);
		}).config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('codeswarm');
        localStorageServiceProvider.setDefault("urlprefix", "http://localhost:1337");
    }).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }]);
