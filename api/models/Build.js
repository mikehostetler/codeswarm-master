/**
 * Foo
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var goBuild = require('../../lib/build');

module.exports = {


  tableName: 'builds',

  autoCreatedAt: false,
  autoUpdatedAt: false,

  attributes: {

    project: {
      type: 'string',
      required: true
    },

    repo: {
      type: 'string',
      required: true
    },

    branch: 'string',

    dir: {
      type: 'string',
      required: true
    },

    created_at: 'integer',
    started_at: 'integer',
    ended_at: 'integer',

    data: 'json',

    ended: 'boolean',

    last_command: 'json',

    previous_build: 'string',


    stage: 'string',
    state: 'string',
    success: 'boolean',

    triggered_by: 'string'

  },

  afterCreate: goBuild
};