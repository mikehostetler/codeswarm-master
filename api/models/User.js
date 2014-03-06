/**
 * Foo
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  adapter: 'couchdb',

  tableName: '_users',

  schema: false,

  attributes: {

    _id: {
      type: 'string',
      required: true
    },

    email: {
      type: 'email',
      required: true
    },

    fname: {
      type: 'string',
      required: true
    },

    lname: {
      type: 'string'
    },

    password: {
      type: 'string'
    },

    type: {
      type: 'string',
      required: true,
      defaultsTo: 'user'
    },

    name: {
      type: 'string',
      required: true
    },

    roles: {
      type: 'array',
      defaultsTo: []
    }

  },

  beforeValidation: function beforeValidation(attrs, next) {
    if (! attrs._id) attrs._id = 'org.couchdb.user:' + attrs.email;
    if(! attrs.name) attrs.name = attrs.email;
    if (! attrs.roles) attrs.roles = [];
    next();
  },

  beforeCreate: function beforeCreate(attrs, next) {
    next(null, attrs);
  }
};
