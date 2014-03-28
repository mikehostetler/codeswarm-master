#!/usr/bin/env node

var bootstrap = require('./bootstrap');

bootstrap(['Project', 'User'], fetchOne);

var projectIndex = 0;
var pageSize = 1;

function fetchOne() {
  console.log('fetch %d', projectIndex);
  Project.find().limit(pageSize).skip(projectIndex).exec(foundProject);
}

function foundProject(err, projects) {
  console.log('found');
  if (err) return ended(err);
  if (! projects.length) return ended();
  if (projects.length > pageSize) throw new Error('got more than ' + pageSize + ' projects');
  var project = projects[0];
  console.log('Project:' + project.id);
  projectIndex ++;



  fetchOne();
}

function ended(err) {
  if (err) {
    console.error('ended with error: ' + err.message);
    console.error('\n' + err.stack);
    process.exit(err.code || 1);
    return;
  } else console.log('ended.');
}