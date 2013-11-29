require.config({
    baseUrl: "js",
    paths: {
        "jquery": "vendor/jquery/jquery.min",
        "app": "app"
    }
});

define(["app"], function (app) {
    
    app.init();
    
});