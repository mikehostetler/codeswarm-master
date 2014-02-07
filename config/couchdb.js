var Url = require('url');

exports = module.exports = {
  "url": "http://localhost:5984",
  "admin": {
      "username": "admin",
      "password": "admin"
  }
};

var url = Url.parse(exports.url);
url.auth = exports.admin.username + ':' + exports.admin.password;

exports.admin_url = Url.format(url);