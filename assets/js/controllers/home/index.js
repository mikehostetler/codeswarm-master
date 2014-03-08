define([
  'session'
], function (session) {

  var ctor = {
    displayName: 'Welcome',

    activate: function () {
      session.data(function () {
        console.log(arguments);
      });
    }

  };

  return ctor;
});
