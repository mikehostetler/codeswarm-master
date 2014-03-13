/**
 * Foo
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var uuid = require('../../lib/uuid');

var repoRegex = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?\.git$/;

module.exports = {

  adapter: 'couchdb',

  autoCreatedAt: false,
  autoUpdatedAt: false,

  tableName: 'projects',

  attributes: {

    branch: {
      type: 'string',
      required: true
    },

    started_at: 'integer',
    ended_at: 'integer',

    last_build: 'string',
    last_successful_build: 'string',

    owners: 'array',

    plugins: 'json',

    public: {
      type: 'boolean',
      defaultsTo: false
    },

    repo: {
      type: 'string',
      required: true,
      regex: repoRegex
    },

    secret: {
      type: 'string',
      required: true
    },

    state: 'string',

    type: 'string'
  },

  beforeValidation: function beforeValidation(attrs, next) {
    attrs.secret = uuid();
    next();
  },

  beforeCreate: function beforeCreate(attrs, next) {
    var match = attrs.repo.match(repoRegex);
    attrs.id = match && match[5];
    next();
  }
};
