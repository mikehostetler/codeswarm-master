define([
  "controllers/dom",
  "controllers/router",
  "controllers/session"
], function (dom, Router, session) {

  var router = new Router();

  var error = {
    handleXhrError: handleXhrError
  };

  return error;

  function handleXhrError(xhr) {
    if (xhr.status == 403) {
      session.unset();
      dom.showError('User is not logged in. <a href="#/">Log in</a>.');
    } else dom.showXhrError(xhr);
  }

});
