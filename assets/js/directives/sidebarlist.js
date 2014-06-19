codeswarm.directive('sidebarlist', function () {
    return {
        restrict: 'E',
        scope: {
            data: "=data"
        },
        transclude: false,
        template: '<li><a href="#/project/{{data.reponame}}">' +
            "<strong>{{data.reponame}}</strong> - <time>{{data.repocreated | date:'yyyy-MM-dd HH:mm:ss'}}</time>" +
            '<span>Commit {{data.commitid}} by {{data.commitby}}</span>' +
            '</a></li>',
        link: function (scope, element, attrs) {

        },
        controller: function ($scope, $rootScope, codeswarmService, localStorageService) {

        }
    };
});