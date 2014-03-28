#!/usr/bin/env node

var extend = require('util')._extend;

var Waterline = require('../node_modules/sails/node_modules/waterline');

var couchdb = require('sails-couchdb-orm');

var config = {
  username: 'admin',
  password: 'admin'
};

couchdb.config = config;

var collConfig = {
  adapter: 'couchdb',
  config: config
};
console.log('collection config:', collConfig);

var Project = Waterline.Collection.extend(require('../api/models/Project'), collConfig);

var modelConfig = {
  adapters: { 'couchdb': couchdb }
};

new Project(modelConfig, gotProjectModel);

function gotProjectModel(err, Project) {

  console.log(Project.adapter);
  var projectIndex = 0;
  var pageSize = 1;

  fetch();

  return;


  function fetch() {
    Project.find().limit(pageSize).skip(projectIndex).exec(foundProjects);
  }

  function foundProjects(err, projects) {
    if (err) return ended(err);
    if (! projects.length) return ended();
    if (projects.length > pageSize) throw new Error('got more than ' + pageSize + ' projects');
    var project = projects[0];
    console.log('Project:' + project.id);
    fetch();
  }

  function ended(err) {
    if (err) {
      console.error('ended with error: ' + err.message);
      console.error('\n' + err.stack);
      process.exit(err.code || 1);
      return;
    } else console.log('ended.');
  }
}

