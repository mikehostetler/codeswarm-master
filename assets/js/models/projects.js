/* JSHint checking */

/* global amplify:false */

define(['amplify'],function(require) {
	amplify.request.define('projects','sails',{
		url: '/projects',
        dataType: 'json',
		type: 'GET'
	});

    var Projects = amplify.model.extend({
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
