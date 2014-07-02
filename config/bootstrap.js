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
module.exports.bootstrap = function (cb) {

    async.series([
        initAdminUser,
        initSessionStore,
        initBuildQueue,
        initPlugins,
        startWorker,
        welcomeMessage,
    ], initialized);

    function initAdminUser(cb) {
        /**
         * Default couchDB install authenticates the server with admin/admin, but we need to
         * ensure that an admin user exists or a person can't login
         */
        User.findOne({username: 'admin'}, function (err, user) {
            sails.log.info("loading findOne from Database: ", user, "err: ", err);
            if (err || user === undefined) {
                User.create({
                    username: 'admin',
                    name: 'admin',
                    password: null,
                    email: 'hello@codeswarm.com',
                    roles: [],
                    type: 'user'
                }, function (err, user) {
                    sails.log.info("created user maybe: ", user, "error if not: ", err);
                    if (err) cb(err);

                    cb();
                });
            }
            else {
                // Success!
                cb();
            }
        });
    }

    function initBuildQueue(cb) {
        BuildQueue.init(cb);
    }

    function initPlugins(cb) {
        PluginService.init(cb);
    }

    function initSessionStore(cb) {
        sails.log.info("loading initSessionStore");
        var sessionStore = require('./session');
        var connect = require('../node_modules/connect-couchdb/node_modules/connect');
        if (process.env.COUCH_PORT_5984_TCP_ADDR) {

            couchdbURL = "http://" + process.env.COUCH_PORT_5984_TCP_ADDR + ":" + process.env.COUCH_PORT_5984_TCP_PORT;
            console.log("COUCH DB INITIALIZING: ", couchdbURL);
            var opts = {
                name: sessionStore.session.name || 'sessions',
                host: process.env.COUCH_PORT_5984_TCP_ADDR,
                port: process.env.COUCH_PORT_5984_TCP_PORT,
                username: sessionStore.session.username,
                password: sessionStore.session.password
            };
        } else {
            var opts = {
                name: sessionStore.session.name || 'sessions',
                host: sessionStore.session.host,
                username: sessionStore.session.username,
                password: sessionStore.session.password
            };
        }

        sails.log.info("initSessionStore opts", opts);

        var connect_couchdb = new (require(__dirname + '/../node_modules/connect-couchdb/lib/connect-couchdb.js')(connect))(opts);
        sails.log.info("loading connect_couchdb");
        connect_couchdb.setup(opts, function (err) {
            if (err) {
                sails.log.info("loading connect_couchdb.setup ERROR: ", err);
                cb(err);
            }
            else {
                sails.log.info("loading connect_couchdb.setup Success Calling CB");
                cb();
            }
        });
    }

    function startWorker(cb) {
        sails.log.info("starting Worker!");
        if (process.env.NODE_ENV != 'production') {
            BuildRunner.start();
        }

        process.nextTick(cb);
    }

    function initialized(err) {

        if (err) {
            sails.log.info("initialized ERROR: ", err);
            throw err;
        } else {
            sails.log.info("initialized SUCCESS!!!!");
            cb();
        }
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

        sails.log.info(('To see your app, visit ' + (sails.getBaseurl() || '').underline));
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

