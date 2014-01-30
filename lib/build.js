var queue = require('./queue');

module.exports = build;

function build(build, cb) {
	queue.push(build, cb);
}