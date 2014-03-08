define(['jquery'], function ($) {

  'use strict';

  // Just a simple handler to abstract $.ajax calls
  // from the controllers
  var request = function (req, payload) {
    // If function in url, determine contents
    if (typeof req.url === 'function') {
      req.url = req.url();
    }
    // Return AJAX for *promise
    return $.ajax({
      url: req.url,
      type: req.type,
      data: payload || null
    });
  };

  return request;

});

// * jQuery promise...
