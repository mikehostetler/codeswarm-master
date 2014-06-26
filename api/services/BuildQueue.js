var nano    = require('nano');
var cqs     = require('cqs');
var couchdb = require('../../config/couchdb');

var VISIBILITY_TIMEOUT = 60 * 5; // 5 minutes timeout
var POLL_INTERVAL = 3000;

var options = {
	couch: couchdb.url,
	db: 'build_queue'
};

cqs = cqs.defaults(options);

var queue;

/**
 * Init the Queue
 */
exports.init = function init(cb) {
  var db = nano(couchdb.url);

  db.use(options.db).get('someid', getReplied);
  function getReplied(err) {
    if (err) {
      if (err.reason == 'no_db_file') {
        createDB(function(err) {
          if (err) cb(err);
          else {
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

  function createDB(cb) {
    db.db.create(options.db, cb);
  }

  function createdQueue(err, _queue) {
    if (err) cb(err);
    else {
      sails.config.codeswarm.build_queue = _queue;
      sails.config.codeswarm.build_queue.VisibilityTimeout = VISIBILITY_TIMEOUT;
      cb();
    }
  }
}

/**
 * Push an item onto the Queue
 */
exports.queueBuild = exports.push = function push(build, cb) {
  if (! cb) throw new Error('need callback');
  sails.config.codeswarm.build_queue.send(build, cb);
}

/**
 * Push an item onto the Queue
 */
exports.dequeueBuild = exports.pull = function pull(cb) {
  if ('function' != typeof cb) throw new Error('need callback');

  sails.config.codeswarm.build_queue.VisibilityTimeout = VISIBILITY_TIMEOUT; // HACK
  sails.config.codeswarm.build_queue.receive(pulled);
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
