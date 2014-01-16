var _ = require('underscore'),
	configuration = require("./configuration.js"),
	forever = require("forever-monitor"),
	fs = require("fs"),
	path = require("path"),
	net = require("net"),
	current_dir = path.resolve('.'),
	ExpressRunner,
	expressRunner;

_.mixin(require('underscore.deferred'));

/**
 * @class ExpressRunner
 * Responsible for managing Express instances configured by each repo.
 */
ExpressRunner = function() {
	this.initialize.apply(this, _.toArray(arguments));
	// API
	return {
		'add': this.add.bind(this)
	};
};

_.extend(ExpressRunner.prototype, {

	'servers': {},

	/**
	 * @constructor
	 */
	'initialize': function() {
	},

	'getServer': function(repo) {
		if ( !_.isUndefined(this.servers[repo]) ) {
			return this.servers[repo];
		} else {
			return undefined;
		}
	},

	'setServer': function(repo, server) {
		this.servers[repo] = server;
	},

	'removeServer': function(repo) {
		if ( !_.isUndefined(this.servers[repo]) ) {
			delete this.servers[repo];
		}
	},

	'portTaken': function(port, fn) {
		var tester = net.createServer().once('error', function (err) {
			if (err.code != 'EADDRINUSE') return fn(err)
			fn(null, true)
		}).once('listening', function() {
			tester.once('close', function() {
				fn(null, false)
			}).close()
		}).listen(port);
	},

	'loadConfig': function(build_dir, callback) {
		var config;
		fs.readFile(build_dir + "/.vouch.json", function (err, config) {
			if (err) {
				callback(err);
			} else {
				config = JSON.parse(config);
				_.defaults(config, {
					'express': {}
				});
				_.defaults(config.express, {
					'script': null,
					'port': null
				});
				callback(null, config);
			}
		});
	},

	'createServer': function(build_dir, config) {
		var d = _.Deferred(),
			p = d.promise(),
			self = this,
			currentServer = this.getServer(config.repo),
			repo_path = path.normalize(build_dir),
			server_script = path.normalize(repo_path + '/' + config.express.script),
			port = parseInt(config.express.port, 10),
			express = require("express"),
			server = express(),
			child;

		if ( !config.express.script ) {
			d.reject('No Express script specified.');
			return p;
		}


		if ( !port ) {
			d.reject('No Express port specified.');
			return p;
		}

		if ( currentServer ) { // Running process already exists.
			currentServer.stop();
			self.removeServer(config.repo);
			self.createServer(build_dir, config);
		} else {
			if ( !fs.existsSync(server_script) ) {
				d.reject('Express script does not exist: ' + server_script);
			} else {
				child = forever.start(['node', server_script, port], {
					max: 1,
					silent: true,
					options: []
				});
				self.setServer(config.repo, child);
				child.on('exit', function () {
					self.removeServer(config.repo);
				});
				d.resolve();
			}
		}

		return p;
	},

	/**
	 * Adds an Express instance to be run / monitored.
	 * @param config {Object} - The entire configuration object for the repo (not just the Express portion)
	 * @param callback {Function} - Callback function to be fired once the Express instance has been setup.
	 */
	'add': function(build_dir, callback) {

		var self = this;

		var fail = function() {
			callback(true);
		};

		this.loadConfig(build_dir, function(err, config) {
			self.portTaken(config.express.port, function(err, taken) {
				if ( taken ) {
					fail();
				} else {
					self.createServer(build_dir, config).done(function(server) {
						callback(null);
					}).fail(function() {
						fail();
					});
				}
			});
		});

	}

});

expressRunner = new ExpressRunner();

module.exports = function() {
	return expressRunner;
};
