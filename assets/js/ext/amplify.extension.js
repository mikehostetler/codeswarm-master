define(['amplify.src','backbone'],function() {
	amplify.model = Backbone.Model;

	Backbone.sync = function(method, model, options) {
		var modelData;
		if(model instanceof Backbone.Model) {
			modelData = model.toJSON();  
		} else { 
			modelData = model.hasOwnProperty('model') ? model.model.toJSON() : {};         
		}
		if (options.data) {
			modelData = _.extend(modelData, options.data);
		}

		amplify.request({
			resourceId: model.url() + '.' + method,
			data: modelData,
			success: function(result) {
				if (options.success) {
					options.success(result);
				}
			},
			error: function(result) {
				if (options.error) {
					options.error(result);
				}
			}
		});
	}

	/**
	 * Sails.js Custom Request Type, to take advantage of Sails.js' ability to talk over Sockets
	 * 
	 * Depends upon sails.io.js being included prior
	 */
	amplify.request.types.sails = function ( defSettings ) {
		defSettings = jQuery.extend({
				type: "get"
			}, defSettings);
		return function ( settings, request ) {

				// Try the request over Socket.io
				var handleResonse, ajaxTypeRequest, 
						url = defSettings.url,
						_io = defSettings.io || settings.io || io || null,
						socketSettings = jQuery.extend( true, {}, defSettings, { data: settings.data } );

				if (!_io) {
					console.error('Amplify `sails` Request Type requires a socket.io client, but `io` was not passed in.');

					// Fall back to Ajax
					ajaxTypeRequest = amplify.request.types.ajax(defSettings);
					ajaxTypeRequest(settings, request);	
				}
				else {
					handleResponse = function(data, status) {
						var socketStatus = status.statusCode;

						if(socketStatus == 200) {
							settings.success(data, status);
						}
						else {
							settings.error(data, status);
						}

						console.debug("Completed Socket request with status", socketStatus,"which returned ",data);
						
						// Ensure we don't handle the response twice
						handleResponse = jQuery.noop;
					}

					data = jQuery.extend( true, {}, defSettings.data, settings.data);

					socketSettings.url = socketSettings.url.replace( /\{([^\}]+)\}/g, function ( m, key ) {
						if ( key in data) {
							return data[ key ];
						}
					});

					// Reassign the request type and make it lower case so Sails.js picks it up
					// Supports 'get','post','delete' and 'put'
					socketSettings.method = socketSettings.type.toLowerCase();

					console.debug("Attempting Socket Request to",socketSettings.url,socketSettings);
					_io.socket._request(socketSettings,handleResponse);
				}
			}
	}

	return amplify;
});
