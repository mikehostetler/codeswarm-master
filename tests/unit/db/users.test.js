var test  = require('tap').test;
var utils = require('../../utils');
var db    = require('../../../db');
var users = require('../../../db/users');

var username = utils.randomString();
var password = utils.randomString();
var sessionId;

test('can\'t login before creating user', function(t) {
  users.authenticate(username, password, function(err) {
    t.type(err, Error);
    t.end();
  });
});

test('user creation', function(t) {
  users.create({name: username, password: password}, function(err) {
    if (err) throw err;
    t.end();
  });
});

test('can login after creating user', function(t) {
  users.authenticate(username, password, function(err, _sessionId) {
    if (err) throw err;
    t.type(_sessionId, 'string');
    sessionId = _sessionId;
    t.end();
  });
});

test('can remove self', function(t) {
  db.session(username, sessionId).users().remove(function(err) {
    if (err) throw err;
    t.end();
  });
});

test('can\'t login after removing user', function(t) {
  users.authenticate(username, password, function(err) {
    t.type(err, Error);
    t.end();
  });
});