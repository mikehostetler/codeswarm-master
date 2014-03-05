/* global describe, it, expect */
define(function(require) {

  describe("Test", function () {

    describe("Something", function(){
      it("should tell us what stuff is", function(){
        var test = "stuff";
        test.should.equal("stuff");
      });
    });

  });

});