define(['jquery'], function ($) {

  // Just a simple handler to abstract $.ajax calls
  // from the controllers
  var request = function (req, payload) {
    $.ajax({
      url: req.url,
      type: req.type,
      data: payload || {},
      success: req.done,
      error: req.fail
    });
  };

  return request;

});