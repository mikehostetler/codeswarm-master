function newprojectindexController($scope, $rootScope, codeswarmService, localStorageService) {

    $scope.project = {
        repo: $scope.strRepository,
        branch: $scope.strBranch,
        public: $scope.publicrepo,
        type: $scope.selectedtype,
        owners: $scope.ownersArray
    };

    $scope.newproject = function (newproject) {
        console.log("new projects: ", newproject);
        $scope.results = codeswarmService.newproject($scope.project).then(function(data){
            console.log("new project results: ", data);
        });
    }

    $scope.projectType = [
        { id: "node", "name": "node" },
        { id: "browser", "name": "browser" },
        { id: "custom", "name": "custom" }
    ]

}