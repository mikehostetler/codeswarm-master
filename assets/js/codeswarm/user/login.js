define([
  'knockout'
],

function(ko) {
    var ctor = function () {
        var self = this;
        this.displayName = 'Login';
        this.username = ko.observable('');
        this.password = ko.observable('');
        this.tryLogin = function () {
          console.log(self.username() + " " + self.password());
          //console.log("Login!");
        };
    };
    return ctor;
});
