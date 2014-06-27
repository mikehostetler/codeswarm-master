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

		passports: {
		  collection: 'passport',
			via: 'user'
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
    if (! attrs.id) attrs.id = attrs.username;
    if (! attrs.roles) attrs.roles = [];
    next();
  },

  beforeCreate: function beforeCreate(attrs, next) {
		attrs.id = attrs.username;
    next(null, attrs);
  },

  beforeUpdate: function beforeCreate(attrs, next) {
		// Leaving this as a shim in case we need it
    next(null, attrs);
  },

  getTokens: function getTokens(user, cb) {
		Passport.find({ user: user.username },function(err, passports) {
				if (err) cb(err);
				else if (!passports) cb(new Error('No tokens found!'));

				user.tokens = user.tokens || {};

				for (var i=0; i<passports.length; i++) {
					pass = passports[i];
					user.tokens[pass.provider] = {	
							token: pass.tokens.accessToken || null,
							username: pass.profile.login || null,
							id: pass.identifier || null 
						};
				}

				cb(null, user);
			});
  },

	tokenFor: function tokenFor(username, provider, cb) {
		User.findOne({username: username}, function (err, user) {
			if (err) cb(new Error('Could not find User'));
			else if (user == undefined) cb(new Error('Could not find User'));

			user = User.toJSON(user);
			User.getTokens(user,function(err, user) {
				if (err) cb(new Error('Error retrieving Tokens'));
				else cb(null, user.tokens && user.tokens[provider]);
			});
		});
	}
};
