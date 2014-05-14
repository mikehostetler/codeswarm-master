define(['amplify'],function(require) {
	amplify.request.define('projects','sails',{
		url: '/projects',
		type: 'GET'
	});

	return {
		// Public Methods
		getAllProjects: function(cb) {
			amplify.request({
				resourceId: 'projects',
				success: function(data) {
					amplify.publish('projects',data);
					if(cb) {
                        cb(true);
                    }
				},
				error: function() {
					amplify.publish('projects',false);
					if(cb) {
                        cb(false);
                    }
				}
			});
		},
	};
});
