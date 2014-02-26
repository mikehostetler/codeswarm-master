define(['jquery'], function ($) {

  'use strict';

  // Just a simple handler to abstract $.ajax calls
  // from the controllers
  var request = function (req, payload) {
    return $.ajax({
      url: req.url,
      type: req.type,
      data: payload || {}
    });
  };

  return request;

});