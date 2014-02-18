var Url = require('url');

exports = module.exports = {
  "url": process.env.COUCHDB_URL || "http://localhost:5984",
  "admin": {
      "username": process.env.COUCHDB_USERNAME || "trevan",
      "password": process.env.COUCHDB_PASSWORD || "trevan"
  }
};

var url = Url.parse(exports.url);
url.auth = exports.admin.username + ':' + exports.admin.password;

exports.admin_url = Url.format(url);