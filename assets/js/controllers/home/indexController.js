function indexController($scope, $rootScope, codeswarmService, localStorageService, $location, usSpinnerService){
    if(codeswarmService.isloggedin()){
        $scope.loggedin = true;
        $scope.userdata = localStorageService.get("userdata").user;
        codeswarmService.tryGetAllProjects().then(function(data){
            console.log("Project Data: ", data);
        })
    }else{
        $scope.loggedin = false;
        $location.path("/user/login");
    }

    $scope.projects = [{reponame:"test", repocreated:"1402991707",commitid:"6s8df4s98d4f",commitby:"chezhead", status:"deploying", branch:"master", build:"running"},
        {reponame:"jquery", repocreated:"1402991717",commitid:"s58adf654",commitby:"bobseager", status:"paused", branch:"master", build:"running"},
        {reponame:"slothlib", repocreated:"1403423706",commitid:"",commitby:"erindonavin", status:"failed", branch:"master", build:"failed"},
        {reponame:"bquery", repocreated:"1592812506",commitid:"",commitby:"petercheney", status:"succeeded", branch:"master", build:"succeeded"}]
}