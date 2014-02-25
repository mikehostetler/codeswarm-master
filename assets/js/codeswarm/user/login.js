define([
  'knockout'
],

function(ko) {
    var ctor = function () {
        this.displayName = 'Login';
        this.tryLogin = function () {
          console.log('login!');
        };
    };
    return ctor;
});
