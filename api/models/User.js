/**
 * Foo
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  tableName: 'users',
  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {

    username: {
      type: 'string',
      required: true
    },

    email: {
      type: 'email',
      required: true
    },

    fname: 'string',
    lname: 'string',
    password: 'string',

    type: {
      type: 'string',
      required: true,
      defaultsTo: 'user'
    },

    roles: {
      type: 'array',
      defaultsTo: []
    },

    tokens: {
      type: 'json'
    },

    derived_key: 'string',
    iterations: 'integer',
    password_scheme: 'string',
    salt: 'string'
  },

	/*
	toObject: function(obj) {
		var obj = obj || this.toObject();
		delete obj.tokens;
		delete obj.salt;
		delete obj.derived_key;
		delete obj.password_scheme;
		return obj;
	},
	*/

	toJSON: function(obj) {
		var obj = obj || this.toObject();
		delete obj.tokens;
		delete obj.salt;
		delete obj.derived_key;
		delete obj.password_scheme;
		return obj;
	},

  beforeValidate: function beforeValidation(attrs, next) {
    if (! attrs.id) attrs.id = userIdFromUsername(attrs.username);
    if (! attrs.roles) attrs.roles = [];
    next();
  },

  beforeCreate: function beforeCreate(attrs, next) {
		attrs.id = userIdFromUsername(attrs.username);
    next(null, attrs);
  },

  beforeUpdate: function beforeCreate(attrs, next) {
		// Leaving this as a shim in case we need it
    next(null, attrs);
  },

  userIdFromUsername: userIdFromUsername,

  tokenFor: function tokenFor(username, provider, cb) {
    this.findOne({id: userIdFromUsername(username)}, replied);

    function replied(err, user) {
      if (err) cb(err);
      else if (! user) cb(new Error('No such user'));
      else cb(null, user.tokens && user.tokens[provider]);
    }
  }
};

function userIdFromUsername(username) {
	return username;
	//return 'org.couchdb.user:' + username;
}
