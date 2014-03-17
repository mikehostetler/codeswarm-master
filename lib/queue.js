var cqs     = require('cqs');
var db      = require('../api/db');
var couchdb = require('../config/couchdb');

var VISIBILITY_TIMEOUT = 60 * 5; // 5 minutes timeout
var POLL_INTERVAL = 3000;

var options = {
  couch: couchdb.admin_url,
  db: 'cqs'
};

cqs = cqs.defaults(options);

var queue;

/// init

exports.init = init;

function init(cb) {
  db.privileged(options.db, function(err, db) {
    if (err) cb(err);
    else db.get('someid', getReplied);

    function getReplied(err) {
      //console.log('GET REPLIED', err);
      if (err) {
        if (err.reason == 'no_db_file') {
          createDB(function(err) {
            if (err) cb(err);
            else {
              console.log('created.');
              init(cb);
            }
          });
        }
        else if (err.reason == 'missing') err = undefined;
        else cb(err);
      }

      if (! err) {
        cqs.CreateQueue({
            QueueName: 'builds',
            DefaultVisibilityTimeout: VISIBILITY_TIMEOUT},
          createdQueue);
      }
    }
  });

  function createDB(cb) {
    console.log('creating queue CouchDB database...');
    db.privileged(function(err, db) {
      if (err) cb(err);
      else db.db.create(options.db, cb);
    });
  }


  function createdQueue(err, _queue) {
    if (err) cb(err);
    else {
      queue = _queue;
      queue.VisibilityTimeout = VISIBILITY_TIMEOUT;
      cb();
    }
  }

}


/// push

exports.push = push;

function push(m, cb) {
  if (! cb) throw new Error('need callback');
  console.log('GOING TO QUEUE build:', m);
  queue.send(m, cb);
}

/// pull

exports.pull = pull;

function pull(cb) {
  if ('function' != typeof cb) throw new Error('need callback');

  queue.VisibilityTimeout = VISIBILITY_TIMEOUT; // HACK
  queue.receive(pulled);
  var m;

  function pulled(err, messages) {
    if (err) cb(err);
    else {
      m = messages && messages.length && messages[0];
      if (m) cb(null, m.Body, done);
      else setTimeout(pull.bind(null, cb), POLL_INTERVAL);
    }
  }

  function done(err) {
    if (err) console.error(err.stack || err);
    m.del(deleted);
  }

  function deleted(err) {
    if (err) console.error(err);
  }
}