function registerController($scope, $rootScope, codeswarmService, localStorageService, $location) {
    $scope.usermodel = {
        'username': $scope.username,
        'email': $scope.email,
        'password': $scope.password
    };

    $scope.prefix = localStorageService.get('urlprefix');

    $scope.register = function (usermodel) {
        codeswarmService.createUser(usermodel).then(function(data){
            console.log("New User: ", data);
            localStorageService.set("newUser", data);
            $location.path("/home");
        });
    }
}