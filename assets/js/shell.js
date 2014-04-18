define(function (require) {
    var router = require('plugins/router');

alert('hi hi');
 
    return {
        router: router,
        activate: function() {
            router.map([
                { route: '', moduleId: 'routes/login_route'},
                { route: 'projects', moduleId: 'routes/projects_route', nav: true },
            ]).buildNavigationModel();
 
            return router.activate();
        }
    };
});
