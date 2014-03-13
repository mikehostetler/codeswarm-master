/**
 * Foo
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */

var extend  = require('util')._extend;
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

    branch: {
      type: 'string',
      defaultsTo: 'master'
    },

    commit: {
      type: 'string',
      defaultsTo: 'HEAD'
    },

    type: {
      type:'string',
      required: true
    },

    dir: {
      type: 'string',
      required: true
    },

    plugins: {
      type: 'json',
      required: true
    },

    stages: 'json',

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

  afterCreate: goBuild,

  forShow: forShow
};

function forShow(build) {
  build = extend({}, build);
  var stages = build.stages;
  if (! stages) return build;
  var stageArray = [];
  Object.keys(stages).forEach(function(stageName) {
    var stage = stages[stageName];
    if (stage.commands && stage.commands.length) {
      stageArray.push({
        name: stageName,
        commands: stage.commands,
        ended: stage.ended,
        ended_at: stage.ended_at
      });
    }
  });

  build.stages = stageArray;

  return build;
}