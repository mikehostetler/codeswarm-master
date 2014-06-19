codeswarm.directive('projectlist', function () {
    return {
        restrict: 'E',
        scope: {
            data: "=data"
        },
        transclude: false,
        template: '<tr>' +
                '<td class="center status-col" >{{data.status}}</td>' +
                '<td class="center run-col">{{data.build}}</td>' +
                '<td></td>' +
                '<td class="center logs-col">{{data.branch}}</td>' +
                '<td class="center logs-col">{{data.commitid}}</td>' +
                '</tr>',
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {

        }
    };
});