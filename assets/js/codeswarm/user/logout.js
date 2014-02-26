define(function() {
    var ctor = {

        // Set displayName
        displayName: 'Log Out',

        activate: function () {
          // Not sure on sessions/models yet,
          // assume we just need to release all
          // client-side stores on activate then
          // pass the user to another route...
        }

    };

    return ctor;

});
