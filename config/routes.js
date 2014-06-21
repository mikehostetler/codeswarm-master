/**
 * Routes
 *
 * Sails uses a number of different strategies to route requests.
 * Here they are top-to-bottom, in order of precedence.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */



/**
 * (1) Core middleware
 *
 * Middleware included with `app.use` is run first, before the router
 */


/**
 * (2) Static routes
 *
 * This object routes static URLs to handler functions--
 * In most cases, these functions are actions inside of your controllers.
 * For convenience, you can also connect routes directly to views or external URLs.
 *
 */

module.exports.routes = {
    // By default, your root route (aka home page) points to a view
    // located at `views/home/index.ejs`
    //
    // (This would also work if you had a file at: `/views/home.ejs`)
    '/': 'SiteController',

    /*
     // But what if you want your home page to display
     // a signup form located at `views/user/signup.ejs`?
     '/': {
     view: 'user/signup'
     }


     // Let's say you're building an email client, like Gmail
     // You might want your home route to serve an interface using custom logic.
     // In this scenario, you have a custom controller `MessageController`
     // with an `inbox` action.
     '/': 'MessageController.inbox'


     // Alternatively, you can use the more verbose syntax:
     '/': {
     controller: 'MessageController',
     action: 'inbox'
     }


     // If you decided to call your action `index` instead of `inbox`,
     // since the `index` action is the default, you can shortcut even further to:
     '/': 'MessageController'


     // Up until now, we haven't specified a specific HTTP method/verb
     // The routes above will apply to ALL verbs!
     // If you want to set up a route only for one in particular
     // (GET, POST, PUT, DELETE, etc.), just specify the verb before the path.
     // For example, if you have a `UserController` with a `signup` action,
     // and somewhere else, you're serving a signup form looks like:
     //
     //		<form action="/signup">
     //			<input name="username" type="text"/>
     //			<input name="password" type="password"/>
     //			<input type="submit"/>
     //		</form>

     // You would want to define the following route to handle your form:
     'post /signup': 'UserController.signup'


     // What about the ever-popular "vanity URLs" aka URL slugs?
     // (you might remember doing this with `mod_rewrite` in Apache)
     //
     // This is where you want to set up root-relative dynamic routes like:
     // http://yourwebsite.com/twinkletoez
     //
     // NOTE:
     // You'll still want to allow requests through to the static assets,
     // so we need to set up this route to ignore URLs that have a trailing ".":
     // (e.g. your javascript, CSS, and image files)
     'get /*(^.*)': 'UserController.profile'

     */

		/**
		 * Authentication
		 */
    // Callbacks for local registration & authentication
    'post /auth/local': { controller: 'AuthController', action: 'callback' },
    'post /auth/local/:action': { controller: 'AuthController', action: 'callback' },

    // Callbacks for each Passport.js provider
    'get /auth/:provider': { controller: 'AuthController', action: 'provider' },
    'get /auth/:provider/callback': { controller: 'AuthController', action: 'callback' },

    // Logout action
    'get /logout': { controller: 'AuthController', action: 'logout' },

		/**
		 * Users
		 */
    // User Object management routes
    // Delete is intentionally not here for security
    // Automatic blueprint URL's are turned off on the User Model
    // because we want people to register and properly create a
    // Passport (see /auth/local above)
    'get /user/:id?': { controller: 'UserController', action: 'find' },
    'post /user/:id': { controller: 'UserController', action: 'update' },


		/**
		 * Projects
		 */
		// List projects available on the provider
		'get /projects/:provider': { controller: 'ProjectController', action: 'gatherByProvider' }
		
		// Create a project for a provider
    'post /projects': { controller: 'ProjectController', action: 'create' },

		// List available projects
    'get /projects': { controller: 'ProjectController', action: 'list' },
    'get /:project-id': { controller: 'ProjectController', action: 'find' },
	
		// Edit & Delete 
    'post /:project-id': { controller: 'ProjectController', action: 'edit' },
    'post /:project-id/plugins': { controller: 'ProjectController', action: 'updatePlugins' },
    'delete /:project-id': { controller: 'ProjectController', action: 'delete' },

		/**
		 * Tags
		 */
    'get /:project-id/tags': { controller: 'TagController', action: 'list' },
    'post /:project-id/tags': { controller: 'TagController', action: 'create' },
    'get /:project-id/:tag': { controller: 'TagController', action: 'find' },
    'delete /:project-id/:tag': { controller: 'TagController', action: 'delete' },
    'post /:project-id/:tag/star': { controller: 'TagController', action: 'starTag' },
    'delete /:project-id/:tag/star': { controller: 'TagController', action: 'unstarTag' },

		/**
		 * Branches
		 */
    'get /:project-id/branches': { controller: 'BranchController', action: 'list' },
    'get /:project-id/:branch': { controller: 'BranchController', action: 'find' },

		/**
		 * Targets
		 */
    'get /:project-id/targets': { controller: 'TargetController', action: 'list' },
    'post /:project-id/targets': { controller: 'TargetController', action: 'create' },
    'get /:project-id/:target': { controller: 'TargetController', action: 'find' },
    'delete /:project-id/:target': { controller: 'TargetController', action: 'delete' },

		/**
		 * Target Actions
		 */
    'get /:project-id/:target/build': { controller: 'TargetController', action: 'find' },
    'get /:project-id/:target/deploy': { controller: 'TargetController', action: 'find' },

		/**
		 * Builds
		 */
    'get /:project-id/builds': { controller: 'BuildController', action: 'index' },
    'get /:project-id/:build': { controller: 'BuildController', action: 'find' },
    'get /:project-id/builds/tags': { controller: 'BuildController', action: 'byTag' },

		/**
		 * Plugins
		 */
    'get /plugin/:type': { controller: 'PluginController', action: 'list' },

		/**
		 * Catch All Route
		 */
    'get /[^.?]+?': { controller: 'SiteController', action: 'redirect' },

		/*****************************
		 * OLD ROUTES
		 *****************************/
    'get /projects': { controller: 'ProjectController', action: 'list' },
    'get /projects/:owner/:repo': { controller: 'ProjectController', action: 'find' },

    'get /projects/:owner/:repo/tags': { controller: 'ProjectController', action: 'tags' },
    'put /projects/:owner/:repo/tags/:tag/star': { controller: 'ProjectController', action: 'starTag' },
    'delete /projects/:owner/:repo/tags/:tag/star': { controller: 'ProjectController', action: 'unstarTag' },
    'put /projects/:owner/:repo/tags/:tag/content': { controller: 'ProjectController', action: 'saveTagContent' },

    'post /projects': { controller: 'ProjectController', action: 'create' },
    'post /:owner/:repo/deploy': { controller: 'ProjectController', action: 'deploy' },
    'post /:owner/:repo/webhook': { controller: 'ProjectController', action: 'webhook' },
    'delete /projects/:owner/:repo': { controller: 'ProjectController', action: 'destroy' },

    'put /projects/:owner/:repo': { controller: 'ProjectController', action: 'update' },
    'put /projects/:owner/:repo/plugins': { controller: 'ProjectController', action: 'updatePlugins' },
    'get /projects/:owner/:repo/builds': { controller: 'BuildController', action: 'index' },
    'get /projects/:owner/:repo/builds/tags': { controller: 'BuildController', action: 'byTag' },
    'get /projects/:owner/:repo/builds/:build': { controller: 'BuildController', action: 'find' }
};


/**
 * (3) Action blueprints
 * These routes can be disabled by setting (in `config/controllers.js`):
 * `module.exports.controllers.blueprints.actions = false`
 *
 * All of your controllers ' actions are automatically bound to a route.  For example:
 *   + If you have a controller, `FooController`:
 *     + its action `bar` is accessible at `/foo/bar`
 *     + its action `index` is accessible at `/foo/index`, and also `/foo`
 */


/**
 * (4) Shortcut CRUD blueprints
 *
 * These routes can be disabled by setting (in config/controllers.js)
 *            `module.exports.controllers.blueprints.shortcuts = false`
 *
 * If you have a model, `Foo`, and a controller, `FooController`,
 * you can access CRUD operations for that model at:
 *        /foo/find/:id?    ->    search lampshades using specified criteria or with id=:id
 *
 *        /foo/create        ->    create a lampshade using specified values
 *
 *        /foo/update/:id    ->    update the lampshade with id=:id
 *
 *        /foo/destroy/:id    ->    delete lampshade with id=:id
 *
 */

/**
 * (5) REST blueprints
 *
 * These routes can be disabled by setting (in config/controllers.js)
 *        `module.exports.controllers.blueprints.rest = false`
 *
 * If you have a model, `Foo`, and a controller, `FooController`,
 * you can access CRUD operations for that model at:
 *
 *        get /foo/:id?    ->    search lampshades using specified criteria or with id=:id
 *
 *        post /foo        -> create a lampshade using specified values
 *
 *        put /foo/:id    ->    update the lampshade with id=:id
 *
 *        delete /foo/:id    ->    delete lampshade with id=:id
 *
 */

/**
 * (6) Static assets
 *
 * Flat files in your `assets` directory- (these are sometimes referred to as 'public')
 * If you have an image file at `/assets/images/foo.jpg`, it will be made available
 * automatically via the route:  `/images/foo.jpg`
 *
 */



/**
 * (7) 404 (not found) handler
 *
 * Finally, if nothing else matched, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 */

