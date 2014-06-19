codeswarm.directive('project', function () {
    return {
        restrict: 'E',
        scope: {
            projectdata: '=data'
        },
        transclude: false,
        template: '' +
            '<td>' +
                '<div class="anchor-wrap">' +
                    '<a ng-href="projectdata.project_url" title="Build Passing">' +
                        '<img src="../images/build-passing.png" alt="Build Passing">' +
                    '</a>' +
                '</div>' +
                '</td>' +
                '<td>' +
                    '<div class="anchor-wrap">' +
                        '<a ng-href="projectdata.project-url">' +
                            '<h4 class="project">{{projectdata._id}}</h4>' +
                            '<em class="repo">{{projectdata.repo}}</em>' +
                        '</a>' +
                    '</div>' +
                '</td>' +
                '<td>' +
                '<div class="anchor-wrap">' +
                    '<a ng-href="projectdata.project-url">' +
                        '<span class="last-build" data-timestamp="">' +
                        '</span>' +
                    '</a>' +
                '</div>' +
            '</td>',
        link: function (scope, element, attrs) {

        },
        controller: function ($scope) {

        }
    };
});