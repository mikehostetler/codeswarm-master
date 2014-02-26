define([
  'jquery'
], function ($) {

  var dom = {

    // Cache elements
    $notification: $('#notification'),

    // Show notification modal
    // type = error, success
    showNotification: function (type, message) {
      var self = this;
      self.$notification.addClass(type).children("div").html(message);
      // Auto-close after timeout
      var closer = setTimeout(function () {
        self.$notification.removeClass(type);
      }, 3000);
      // Bind close button
      self.$notification.find("a").click(function () {
        self.$notification.removeClass(type);
        window.clearTimeout(closer);
      });
    }

  };

  return dom;

});