/**
 * Foo
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  tableName: 'build_data',

  attributes: {
    project: {
      type: 'string',
      required: true
    },

    commit: 'string',

    tags: {
      type: 'array',
      defaultsTo: []
    },

    data: {
      type: 'json',
      defaultsTo: {}
    }
  }
};
