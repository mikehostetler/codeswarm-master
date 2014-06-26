var domain   = require('domain');
var async    = require('async');
var Plugins  = require('./PluginService');
var buildObserver = require('./BuildObserver');
//var stageFunction = require('../../lib/stage_function');

// TODO - Put this into global config
if(process.env.CODESWARM_REMOTE === 'true') {
  var Worker   = require('./RemoteWorker');
} else {
  var Worker   = require('./SimpleWorker');
}

/**
 * Dequeue a Build
 */
exports.start = function start() {
  dequeue();

	function dequeue() {
		BuildQueue.dequeueBuild(dequeued);
	}

	function dequeued(err, build, done) {
		if (err) {
			setTimeout(dequeue, 3000);
			err.message = 'Error while dequeueing:' + err.message;
			sails.log.error(err.stack || err);
		} else {
			process.nextTick(dequeue);
			sails.log.info('Worker dequeued build '+build.id+' for project '+build.project);
			BuildRunner.runBuild(build, done);
		}
	}
}

/**
 * Run a full build
 */
exports.runBuild = function runBuild(build, dequeueBuildCB) {
	var buildConfig = {};

  var buildDomain = domain.create();
  buildDomain.on('error', onDomainError);

  function onDomainError(err) {

		sails.log.error("-----------------------------------------------");
		sails.log.error(" DOMAIN ERROR:");
    sails.log.error(err.stack || err);
		//sails.log.error(buildConfig);
		sails.log.error("-----------------------------------------------");

		dequeueBuildCB(err);
		/*
    if (worker) 
			worker.error(err);
			*/

		/*
		// TODO - Close this down better
    callback(err);
		function callback(err) {
			if (!ended) {
				ended = true;
				//done(err);
			}
		}
		*/
  }

  buildDomain.run(runDomainBuild); 
  function runDomainBuild() {
		sails.log.silly('BuildRunner::runDomainBuild - Kicking off a build for the '+build.project+' project');

		/**
		 * MASTER BUILD WORKFLOW
		 */
		try {
			async.waterfall([
				function(cb) {
					async.parallel({
						current: loadCurrentBuild,
						previous: loadPreviousBuild
					}, cb);
				},

				// Lets get started!
				initBuild,

				startWorker,

				// 
				function observeBuild(buildConfig,cb) {
					//buildObserver.addWorker(buildConfig.current, buildConfig.worker);
					cb(null, buildConfig);
				},

				// Run our build through all of the stages!
				workerRunStages,
				// Iterate over each stage
				// -- stageRunPlugins

				// Iterate over each plugin within the stage
				// -- -- pluginRunFn

				// Clean up
				finishBuild,
			],function (err, result) {
				if(err) dequeueBuildCB(err);
				console.log('Finished our build!');
				dequeueBuildCB();
			});
		}
		catch(err) {
			dequeueBuildCB(err);
		}
  }

  function loadCurrentBuild(cb) {
		sails.log.silly('[BUILD] BuildRunner::LoadCurrentBuild - Finding Build '+build.id);
    Build.findOne({_id: build.id}, cb);
  }

  function loadPreviousBuild(cb) {
		sails.log.silly('[BUILD] BuildRunner::LoadPreviousBuild - Finding Build '+build.previous_successful_build);
    if (build.previous_successful_build) {
      Build.findOne({_id:build.previous_successful_build}, cb);
		}
    else cb();
  }

  function initBuild(config, cb) {
		buildConfig = config;
		sails.log.silly('[BUILD] BuildRunner::Initializing the Build!');

		buildConfig.stages = sails.config.codeswarm.build_stages;
		buildConfig.ended = false;
		buildConfig.ranCleanup = false;
		buildConfig.contexts = {};
    buildConfig.worker = new Worker(buildConfig.current);
    buildConfig.plugins = Plugins.forBuild(buildConfig.current);
		buildConfig.start = true;

		var build = buildConfig.current;
    if (build.state == 'running' || build.state == 'pending') {
      if (! build.created_at) 
				throw new Error('Need build.created_at value');

      if (! build.fresh) {
				var now = Date.now();
        var timeout = build.created_at + sails.config.codeswarm.timeout_ms;

        buildConfig.start = timeout < now;
        if (buildConfig.start) 
					sails.log.error('build %s for %s timed out, rerunning it', build._id, build.project);
        else 
					sails.log.error('build %s for %s is probably still running, leaving it be', build.id, build.project);
      }

      build.fresh = false;
    }

    if (buildConfig.start) {
      buildConfig.current.created_at = Date.now();
      buildConfig.current.state = 'pending';
      build.save(function(err) {
				if(err) cb(err);
				cb(null, buildConfig);
			});
    }
		else 
			cb(new Error('Could not start the build'));
  }

  function startWorker(buildConfig, cb) {
		sails.log.silly('[BUILD] BuildRunner::Starting the Build');

    if (! buildConfig.plugins.length) 
			throw new Error('No plugins detected for build');

    var workerImages = Plugins.workerImages(buildConfig.plugins, buildConfig.current);

    if (workerImages.length < 1)
      throw new Error('Could not calculate Worker Image');
    else if (workerImages.length >= 1) {
			workerImage = workerImages.pop();
		}

		sails.log.silly(" * [WORKER] Starting worker with the image: ",workerImage);
    buildConfig.worker.init(workerImage, function(err) {
			sails.log.silly(' * [WORKER] Worker successfully initialized!');
			cb(null, buildConfig);
		});
  }

	function workerRunStages(buildConfig, cb) {
		sails.log.silly(' * [WORKER] BuildRunner::Beginning to run Build Stages');

    buildConfig.worker.emit('build.begin');
    async.eachSeries(buildConfig.stages, 
			function(stage, done) {
				stageRunPlugins(stage, buildConfig, done);
			},
			function(err) {
				if(err) {
					buildConfig.worker.emit('build.error',err);
					sails.log.silly(' * [WORKER] BuildRunner::Build Error',err);
					throw new Error('Build Error: '+err);
					cb(err);
				}
				else {
					buildConfig.worker.emit('build.end');
					sails.log.silly(' * [WORKER] BuildRunner::Finished running Build Stages');
					cb(null, buildConfig);
				}
			});

	}

  function stageRunPlugins(stage, buildConfig, cb) {
		sails.log.silly(' * * [STAGE] BuildRunner::Beginning Stage ',stage.name || stage);

    buildConfig.worker.emit('stage.begin', stage.name || stage);
		async.eachSeries(buildConfig.plugins, 
			function(plugin, done) {
				runPlugin(plugin, stage, buildConfig, done);
			},
			function (err) {
				if(err) {
					buildConfig.worker.emit('stage.error',err);
					sails.log.silly(' * *  [STAGE] BuildRunner::Stage Error',err);
					throw new Error('Build Error: '+err);
					cb(err);
				}
				else {
					buildConfig.worker.emit('stage.end');
					sails.log.silly(' * * [STAGE] BuildRunner::Finishing Stage',stage.name || stage);
					cb(null, buildConfig);
				}
			});
  }

	function runPlugin(plugin, stage, buildConfig, cb) {
		sails.log.silly(' * * * [PLUGIN] Plugin '+plugin.name+' at Stage '+stage+' on Project '+build.project);

		if (! buildConfig.contexts[plugin.name]) 
			buildConfig.contexts[plugin.name] = {};

		var context = buildConfig.contexts[plugin.name];
		var config = buildConfig.current.plugins && buildConfig.current.plugins[plugin.name] || {};
		var fn = plugin[stage];
		if ('function' == typeof fn) {
			buildConfig.worker.emit('plugin.start', plugin.name);
			stageFunction(fn.bind(plugin), context, config, buildConfig.current, buildConfig.worker, buildConfig.previous, fnEnded);
		} else cb();

		function fnEnded(err) {
			buildConfig.worker.emit('plugin.end', plugin.name);
			cb(err);
		}
	}

	function stageFunction(fn, context, config, build, worker, previousBuild, cb) {
		var ended = false;

		worker.reset();
		worker.on('end', onEnd);
		worker.on('close', onClose);
		worker.on('error', onError);

		// Call our function
		fn.call(null, build, worker, config, context, previousBuild);

		function onEnd() {
			teardown();
		}

		function onClose(code) {
			if (code != 0) 
				teardown(new Error('Exit code was ' + code));
		}

		function onError(err) {
			teardown(err);
		}

		function teardown(err) {
			if (!ended) {
				worker.removeListener('end', onEnd);
				worker.removeListener('close', onClose);
				worker.removeListener('error', onError);
				ended = true;
				cb(err);
			}
		}
	}

  function finishBuild(buildConfig, cb) {
		sails.log.silly('BuildRunner::Finish Build');
    if (!buildConfig.ranCleanup) {
			async.eachSeries(['cleanup','purge'],
				function(stage, done) {
					stageRunPlugins(stage, buildConfig, done);
				},done2);
		}
    else 
			done2();

    function done2(err2) {
      if (err2) 
				sails.log.error(err2.stack || err2);

      buildConfig.worker.dispose();
      cb(null, buildConfig);
    }
  }

}
