/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

var async = require('async');
var queue = require('../lib/queue');

module.exports.bootstrap = function (cb) {

  async.series([
      initQueue,
      initPlugins,
      startWorker,
			welcomeMessage,
    ], initialized);

  function initQueue(cb) {
    queue.init(cb);
  }

  function initPlugins(cb) {
    require('../lib/plugins').init(cb);
  }

  function startWorker(cb) {
    if (process.env.NODE_ENV != 'production') {
      var runner = require('../lib/runner');
      runner.start();
    }

    process.nextTick(cb);
  }

  function initialized(err) {
    if (err) throw err;
    cb();
  }

	function welcomeMessage(cb) {

		sails.log.info("  .-. . .-..----..-.    .---. .----..-.   .-..----.    .---. .----.    ");
		sails.log.info("  | |/ \\| || {_  | |   /  ___}  {}  \\  `.'  || {_     {_   _}  {}  \\   ");
		sails.log.info("  |  .'.  || {__ | `--.\\     }      / |\\ /| || {__      | | \\      /   ");
		sails.log.info("  `-'   `-'`----'`----' `---' `----'`-' ` `-'`----'     `-'  `----'    ");
		sails.log.info("            .---..-. .-..----.                                         ");
		sails.log.info("           {_   _} {_} || {_                                           ");
		sails.log.info("             | | | { } || {__                                          ");
		sails.log.info("             `-' `-' `-'`----'  ");
		sails.log.info("   _____           _        _____                              ");
		sails.log.info("  /  __ \\         | |      /  ___|                             ");
		sails.log.info("  | /  \\/ ___   __| | ___  \\ `--.__      ____ _ _ __ _ __ ___  ");
		sails.log.info("  | |    / _ \\ / _` |/ _ \\  `--. \\ \\ /\\ / / _` | '__| '_ ` _ \\ ");
		sails.log.info("  | \\__/\\ (_) | (_| |  __/ /\\__/ /\\ V  V / (_| | |  | | | | | |");
		sails.log.info("   \\____/\\___/ \\__,_|\\___| \\____/  \\_/\\_/ \\__,_|_|  |_| |_| |_|");
		sails.log.info("                                                               ");
		
		sails.log.info(('To see your app, visit ' + (sails.getBaseurl()||'').underline));
		sails.log.info(('To shut down CodeSwarm, press <CTRL> + C at any time.'));
		sails.log('--------------------------------------------------------'.grey);
		sails.log((':: ' + new Date()).grey);
		sails.log('');
		sails.log('Environment : ' + sails.config.environment);

		// Only log the host if an explicit host is set
		if (sails.getHost()) {
			sails.log('Host        : ' + sails.getHost()); // 12 - 4 = 8 spaces
		}

		sails.log('Port        : ' + sails.config.port); // 12 - 4 = 8 spaces

    if (process.env.NODE_ENV != 'production') {
			sails.log('Worker Pool : Single Local Simple Worker'); // 12 - 4 = 8 spaces
		}
		sails.log('--------------------------------------------------------'.grey);

		cb();
	}
};

