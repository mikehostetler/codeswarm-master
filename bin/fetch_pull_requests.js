#!/usr/bin/env node

var async     = require('async');
var bootstrap = require('./bootstrap');
var github    = require('../lib/github');

bootstrap(['Project', 'User', 'PullRequest'], next);

var projectIndex = 0-1;
var pageSize = 1;

function process(project, cb) {
  if (project.id.charAt(0) == '_') return cb();

  console.log('project opwners:', project);
  async.map(project.owners || [], getUserGithubKey, gotOwnerKeys);

  function gotOwnerKeys(err, tokens) {
    if (err) return cb(err);

    var token = tokens.filter(exists)[0];
    if (! token) return cb(new Error('no github token found for project ' + project.id));
    else fetchPullRequests(project.id, token.token, gotPullRequests);
  }

  function gotPullRequests(err, pullRequests) {
    if (err) cb(err);
    else async.eachSeries(pullRequests, insertPullRequest, cb);
  }

  function insertPullRequest(pullRequest, cb) {
    PullRequest.create({
      id: pullRequest.id,
      project: project.id,
      github_data: pullRequest
    }, cb);
  }
}


function fetchPullRequests(project, token, cb) {
  github.getPullRequests(project, token, cb);
}


function getUserGithubKey(user, cb) {
  User.tokenFor(user, 'github', function(err, key) {
    if (err) cb(err);
    else cb(null, key);
  });
}

function next() {
  projectIndex ++;
  fetchOne();
}

function fetchOne() {
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

  process(project, processed);

  function processed(err) {
    if (err) console.error(err.stack);
    next();
  }
}

function ended(err) {
  if (err) {
    console.error('ended with error: ' + err.message);
    console.error('\n' + err.stack);
    process.exit(err.code || 1);
    return;
  } else console.log('ended.');
}


/// Misc

function exists(o) {
  return !! o;
}