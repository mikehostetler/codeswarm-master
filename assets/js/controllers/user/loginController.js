function loginController($scope, $rootScope, codeswarmService, localStorageService, $location, usSpinnerService){
    $scope.credentials = { "username": "", "identifier":"" };

    $scope.login = function(credentials){
        usSpinnerService.spin('theSpinner');
        //simple yet effective
        codeswarmService.login(credentials.username, credentials.password).then(function (logindata) {
            usSpinnerService.stop('theSpinner');
            console.log("User Logged in: ", logindata);
            localStorageService.set("userdata", logindata);
            $location.path("/home");
        });
    }

}