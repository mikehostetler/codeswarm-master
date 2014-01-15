/* global mocha */
require.config({
    baseUrl: "../ui/src/js",
    paths: {
        "chai": "vendor/chai/chai",
        "jquery": "vendor/jquery/jquery.min",
        "text": "vendor/requirejs-text/text",
        "handlebars": "vendor/handlebars/handlebars.min",
        "app": "app"
    },
    shim: {
        "handlebars": {
            "exports": "Handlebars"
        }
    }

});

require([], function () {

    require([
        "chai"
    ], function (chai) {
        chai.should();
        window.expect = chai.expect;
        mocha.setup("bdd");

        require([
            "specs.js"
        ], function () {
            mocha.run();
        });
    });

});
