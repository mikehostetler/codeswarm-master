#!/usr/bin/env node
var assert = require('assert');
var request = require('request');

var payload = require('./github_payload');

if (process.argv[2]) {
  payload.repository.name = process.argv[2];
  payload.repository.url = "https://github.com/" + process.argv[2];
}

if (process.argv[3]) {
  payload.after = process.argv[3];
}

var secret;
if (process.argv[4]) {
  secret = process.argv[4];
}

var options = {
  encoding: 'utf8',
  json: payload,
  method: 'POST',
  url: 'http://localhost:1337/' + payload.repository.name + '/webhook?secret=' + encodeURIComponent(secret)
};

request(options, function(err, res, body) {
  if (err) throw err;

  /// webhook should reply 200 to github
  assert.equal(res.statusCode, 200);
});