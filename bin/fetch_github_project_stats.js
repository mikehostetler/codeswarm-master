#!/usr/bin/env node

var async     = require('async');
var extend    = require('util')._extend;
var bootstrap = require('./bootstrap');
var github    = require('../lib/github');

var projectIndex = -1;
var pageSize = 1;

bootstrap(['Project', 'User', 'ProjectStats'], next);

function processProject(project, cb) {
  if (project.id.charAt(0) == '_') return cb();

  console.log(project.id);

  async.map(project.owners || [], getUserGithubKey, gotOwnerKeys);

  function gotOwnerKeys(err, tokens) {
    if (err) return cb(err);

    var token = tokens.filter(exists)[0];
    if (! token) return cb(new Error('no github token found for project ' + project.id));
    else fetchAllProjectData(project.id, token.token, cb);
  }
}

function fetchAllProjectData(project, token, cb) {

  async.parallel({
    repo: getGithubRepo,
    projectStats: getProjectStats,
    releases: getGithubReleases,
    tags: getGithubTags
  }, gotAll);

  function getGithubRepo(cb) {
    github.getRepo(project, token, cb);
  }

  function getProjectStats(cb) {
    ProjectStats.findOne({id: project}, cb);
  }

  function getGithubReleases(cb) {
    github.getReleases(project, token, cb);
  }

  function getGithubTags(cb) {
    github.getTags2(project, token, cb);
  }

  function gotAll(err, results) {
    if (err) return cb(err);

    var projectStats = results.projectStats;
    var repo = results.repo;
    var releases = results.releases;
    var tags = results.tags;

    var stats = {};
    if (!projectStats || repo.forks_count != projectStats.forks)
      stats.forks = repo.forks_count;
    if (!projectStats || repo.stargazers_count != projectStats.stargazers)
      stats.stargazers = repo.stargazers_count;
    if (!projectStats || repo.watchers_count != projectStats.watchers)
      stats.watchers = repo.watchers_count;
    if(!projectStats || projectStats.releases != releases.length)
      stats.releases = releases.length;
    if (!projectStats || projectStats.tags != tags.length )
      stats.tags = tags.length;


    if (projectStats) {
      if (Object.keys(stats).length) {
        extend(projectStats, stats);
        projectStats.save(cb);
      } else cb();
    } else {
      stats.id = project;
      ProjectStats.create(stats, cb);
    }

  }


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
  if (err) return ended(err);
  if (! projects.length) return ended();
  if (projects.length > pageSize) throw new Error('got more than ' + pageSize + ' projects');
  var project = projects[0];
  projectIndex ++;

  processProject(project, processed);

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
  } else process.exit(0);
}


/// Misc

function exists(o) {
  return !! o;
}