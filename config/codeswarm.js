/**
 * CodeSwarm Application Configuration
 *
 * While you're developing your app, this config file should include
 * any settings specifically for your development computer (db passwords, etc.)
 * When you're ready to deploy your app in production, you can use this file
 * for configuration options on the server where it will be deployed.
 *
 *
 * PLEASE NOTE: 
 *		This file is included in your .gitignore, so if you're using git 
 *		as a version control solution for your Sails app, keep in mind that
 *		this file won't be committed to your repository!
 *
 *		Good news is, that means you can specify configuration for your local
 *		machine in this file without inadvertently committing personal information
 *		(like database passwords) to the repo.  Plus, this prevents other members
 *		of your team from commiting their local configuration changes on top of yours.
 *
 *
 * For more information, check out:
 * http://sailsjs.org/#documentation
 */

module.exports = {
	codeswarm: {
		build_stages: [
			'wipe',
			'mkdirp',
			'clone',
			'info',
			'env',
			'prepare',
			'test',
			'analyze',
			'deploy',
			'cleanup',
			'purge'
		],

		// Build Timeout
		timeout_ms: 1000 * 60 * 60, // 60 minutes

		// Build Data Push Interval
		push_interval: 2000,

		// Available build plugins
		// Ordering matters!
		plugins: {
			'codeswarm-base': require('../api/services/plugins/base/index.js'),
			'codeswarm-echo': require('../api/services/plugins/echo/index.js'),
			//'codeswarm-custom': require('codeswarm-custom'),
			//'codeswarm-node': require('codeswarm-node'),
			//'codeswarm-sauce': require('codeswarm-sauce'),
			//'codeswarm-browserstack': require('codeswarm-browserstack'),
			//'codeswarm-plato': require('codeswarm-plato')
		},

		// Project types mapped to plugins
		project_types: {
			node: ['codeswarm-base', 'codeswarm-echo', 'codeswarm-node', 'codeswarm-plato'],
			browser: ['codeswarm-base', 'codeswarm-sauce', 'codeswarm-plato'],
			browser_browserstack: ['codeswarm-base','codeswarm-browserstack', 'codeswarm-plato'],
			custom: ['codeswarm-base','codeswarm-custom', 'codeswarm-plato'],
		},
	}
};
