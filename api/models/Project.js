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

  autoCreatedAt: false,
  autoUpdatedAt: false,

  tableName: 'projects',

  attributes: {

    id: 'string',

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
    if (! attrs.secret) attrs.secret = uuid();
    next();
  },

  beforeCreate: function beforeCreate(attrs, next) {
    var match = attrs.repo.match(repoRegex);
    attrs.id = match && match[5];
    next();
  },

  afterUpdate: afterUpdate,

  views: {
    owner_id_begins_with: {
      map:
        function(doc) {
          var project = doc._id;
          var projectParts = project.split('/');
          var repoOwner = projectParts[0];
          var repoRepo = projectParts[1];
          var owners = [];
          if (doc.public) owners.push('public');
          if (doc.owners) owners = owners.concat(doc.owners);

          owners.forEach(function(owner) {
            emit([owner, repoOwner], doc);
            emit([owner, repoRepo], doc);
            emit([owner, project], doc);
          });
        }
    }
  }
};


function afterUpdate(project, cb) {
  var id = project.id;
  var sockets = sails.io.sockets.in(id);
  for(var attr in project) {
    sockets.emit('update', id, attr, project[attr]);
  }
  cb();
}