/**
 * Session
 * 
 * Sails session integration leans heavily on the great work already done by Express, but also unifies 
 * Socket.io with the Connect session store. It uses Connect's cookie parser to normalize configuration
 * differences between Express and Socket.io and hooks into Sails' middleware interpreter to allow you
 * to access and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#documentation
 */
var URL = require('url');
var couchdbURL = process.env.COUCHDB_URL || "http://localhost:5984";
var url = URL.parse(couchdbURL);

module.exports.session = {

  // Session secret is automatically generated when your new app is created
  // Replace at your own risk in production-- you will invalidate the cookies of your users,
  // forcing them to log in again. 
  secret: 'f52aa780d244aac89224837235c21a24',


	/**
	 * Back our sessions with CouchDB
	 */
	adapter: 'connect-couchdb',

	// Required. If this database doesn't exist, it is created automagically.
	name: 'sessions',

	// Required.  The connect-couchdb package uses the yacw package (https://www.npmjs.org/package/yacw)
	// instead of Nano, which is what the sails-couchdb-orm package uses, so the parameters are slightly
	// different.
	host			: url && url.hostname,
	ssl				: url && (url.protocol === 'https'),
	username	: process.env.COUCHDB_USERNAME || 'admin',
	password	: process.env.COUCHDB_PASSWORD || 'admin',

	// Optional. How often expired sessions should be cleaned up.
	// Defaults to 600000 (10 minutes).
	reapInterval: 1000 * 60 * 10,

	// Optional. How often to run DB compaction against the session
	// database. Defaults to 300000 (5 minutes).
	// To disable compaction, set compactInterval to -1
	compactInterval: 1000 * 60 * 5,

	// Optional. How many time between two identical session store
	// Defaults to 60000 (1 minute)
	setThrottle: 1000 * 60, 

  // In production, uncomment the following lines to set up a shared redis session store
  // that can be shared across multiple Sails.js servers
  // adapter: 'redis',
  //
  // The following values are optional, if no options are set a redis instance running
  // on localhost is expected.
  // Read more about options at: https://github.com/visionmedia/connect-redis
  //
  // host: 'localhost',
  // port: 6379,
  // ttl: <redis session TTL in seconds>,
  // db: 0,
  // pass: <redis auth password>
  // prefix: 'sess:'


  // Uncomment the following lines to use your Mongo adapter as a session store
  // adapter: 'mongo',
  //
  // host: 'localhost',
  // port: 27017,
  // db: 'sails',
  // collection: 'sessions',
  //
  // Optional Values:
  //
  // # Note: url will override other connection settings
  // url: 'mongodb://user:pass@host:port/database/collection',
  //
  // username: '',
  // password: '',
  // auto_reconnect: false,
  // ssl: false,
  // stringify: true

};
