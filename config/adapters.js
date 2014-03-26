/**
 * Global adapter config
 *
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

var URL = require('url');
var couchdbURL = process.env.COUCHDB_URL || "http://localhost:5984";
var couchdbUsername = process.env.COUCHDB_USERNAME || 'admin';
var couchdbPassword = process.env.COUCHDB_PASSWORD || 'admin';

var url = URL.parse(couchdbURL);

module.exports.adapters = {

  // If you leave the adapter config unspecified
  // in a model definition, 'default' will be used.
  'default': 'couchdb',

  'couchdb': {
    module: 'sails-couchdb-orm',
    host: url && url.hostname,
    https: url && (url.protocol === 'https'),
    username: couchdbUsername,
    password: couchdbPassword
  }

};