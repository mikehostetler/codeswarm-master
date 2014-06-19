function codeswarmController($scope, $rootScope, $sce, localStorageService) {
    $scope.trusted = function (url) {
        return $sce.trustAsResourceUrl(url);
    };

    $scope.url_prefix = localStorageService.get("urlprefix");
}