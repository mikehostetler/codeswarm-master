define(function (require) {
    var Projects = require("controllers/projects"),
        assert = require("chai").assert;

    describe("Projects Controller", function () {
        describe("projects object", function () {
            it("should be an object", function () {
                assert.typeOf(Projects, "object", "it is an object");
            });
        });
    });
});
