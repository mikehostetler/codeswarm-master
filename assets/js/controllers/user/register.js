define([
    'knockout',
    'durandal/app',
    'plugins/router'
  ],

  function (ko, app, router) {

    return {

      // Set displayName
      displayName: 'Signup',

      // Setup model
      fname: ko.observable(),
      lname: ko.observable(),
      email: ko.observable(),
      password: ko.observable(),
      confirm_password: ko.observable(),


    }
  });
