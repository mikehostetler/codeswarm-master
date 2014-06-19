function mainController($scope, $rootScope, codeswarmService, localStorageService, $location, usSpinnerService){
    $scope.url_prefix = $rootScope.url_prefix;
    if(codeswarmService.isloggedin()){
        $scope.loggedin = true;
    }else{
        $scope.loggedin = false;
    }

//    $scope.$watch(function(){
//        return $scope.loggedin;
//    }, function(newval, oldval){
//        console.log("watched changed: ", newval, "from: ", oldval);
//    });
}