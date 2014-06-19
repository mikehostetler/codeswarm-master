function logoutController($scope, $rootScope, codeswarmService){
    console.log("Logging Out");
    codeswarmService.logout()
}