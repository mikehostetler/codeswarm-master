define([
  'utils/session'
], function (session) {

	console.log(session);

  return {
    displayName: 'Welcome',

    activate: function () {
			/*
      session.data(function () {
        console.log(arguments);
      });
			*/
    }

  };
});
