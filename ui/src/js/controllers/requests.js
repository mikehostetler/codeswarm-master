define([
    "jquery"
], function ($) {
    
    var requests = {
        
        // No-payload requests (GET, DELETE)
        nopayload: function (url, type) {
            return $.ajax({
                type: type,
                url: url
            });
        },
        
        // Payload request (PUT, POST)
        payload: function (url, payload, type) {
            return $.ajax({
                type: type,
                url: url,
                data: payload
            });
        },
        
        /**
         * Proxy functions
         */
        
        get: function (url) {
            this.nopayload(url, "GET");
        },
        
        put: function (url, payload) {
            this.payload(url, payload, "PUT");
        },
        
        post: function (url, payload) {
            this.payload(url, payload, "POST");
        },
        
        delete: function (url) {
            this.nopayload(url, "DELETE");
        }
        
    };
    
    return requests;
    
});