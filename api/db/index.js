var nano = require('nano');
var config = require('../../config/couchdb');

var base = exports.base = config.url || 'http://localhost:5984';
console.log('CouchDB: %s', base);

exports.public     = nano(base);
exports.privileged = require('./privileged');
exports.session    = require('./session');
exports.wrap       = wrap;

function wrap(options) {
  if (typeof options != 'object') {
    options = {
      url: options
    };
  }

  return nano(options);
}