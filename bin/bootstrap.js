var extend = require('util')._extend;
var async  = require('async');

var Waterline = require('../node_modules/sails/node_modules/waterline');
var couchdb = require('sails-couchdb-orm');
var config = require('../config/adapters').adapters.couchdb;
couchdb.config = extend(couchdb.defaults, config);

module.exports = bootstrap;

function bootstrap(modelNames, cb) {
  async.map(modelNames, bootstrapModel, done);

  function done(err, models) {
    if (err) return cb(err);

    models.forEach(function(model, i) {
      var modelName = modelNames[i];
      global[modelName] = model;
    });

    process.nextTick(cb);
  }
}

function bootstrapModel(modelName, cb) {

  var Model = require('../api/models/' + modelName);
  Model.adapter = 'couchdb';

  var Model = Waterline.Collection.extend(Model);

  var modelConfig = {
    adapters: { 'couchdb': couchdb }
  };

  new Model(modelConfig, cb);
}
