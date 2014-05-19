/* JSHint checking */

/* global amplify:false */

define(['amplify'],function(require) {
	amplify.request.define('projects','sails',{
		url: '/projects',
        dataType: 'json',
		type: 'GET'
	});

	amplify.request.define('project.create','sails',{
		url: '/projects',
		dataType: 'json',
		type: 'POST'
	});

    var Projects = amplify.model.extend({
			urlRoot: 'project'
    },{
		// Public Methods
		tryGetAllProjects: function(cb) {
			amplify.request({
				resourceId: 'projects',
				success: function(data) {
					amplify.publish('projects',data);
					if(cb) {
                        cb(true);
                    }
				},
				error: function(data) {
					amplify.publish('projects',data);
					if(cb) {
                        cb(false);
                    }
				}
			});
		},
	});

    return Projects;
});
