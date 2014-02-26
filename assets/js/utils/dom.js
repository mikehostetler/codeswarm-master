define([
  'jquery'
], function ($) {

  var dom = {

    // Set elements
    notification: '#notification',

    // Show notification modal
    // type = error, success
    showNotification: function (type, message) {
      var notification = $(this.notification);
      notification.addClass(type).children("div").html(message);
      // Auto-close after timeout
      var closer = setTimeout(function () {
        notification.removeClass(type);
      }, 3000);
      // Bind close button
      notification.find("a").click(function () {
        notification.removeClass(type);
        window.clearTimeout(closer);
      });
    }

  };

  return dom;

});