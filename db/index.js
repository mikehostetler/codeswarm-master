var nano = require('nano');
var config = require('../config');

var base = config.couchdb && config.couchdb.url || 'http://localhost:5984';
console.log('CouchDB: %s', base);

module.exports = nano(base);