var connections = require('./connections').connections;
var couchdb = connections.couchdb;

if (! couchdb) 
	throw new Error('Need CouchDB connection defined in config/connections.js');

exports.url = urlForConfig(couchdb);

function urlForConfig(config) {
  var schema = 'http';
  if (config.https) schema += 's';

  var auth = '';
  if (config.username && config.password) {
    auth = encodeURIComponent(config.username) + ':' + encodeURIComponent(config.password) + '@';
  }

  return [
    schema,
    '://',
    auth,
    config.host || 'localhost',
    ':',
    config.port || 5984
  ].join('');
}
