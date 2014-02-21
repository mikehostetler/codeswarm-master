/**
 * SiteController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
	// Render Index View
	index: function(req, res) {
		res.view({ 
			partials: {
				'_header': '../partials/_header',
				'_page-cap': '../partials/_page-cap',
				'_search': '../partials/_search',
				'_top-projects': '../partials/_top-projects',
				'_info-grid': '../partials/_info-grid',
				'_share-bar': '../partials/_share-bar',
				'_footer-links': '../partials/_footer-links',
				'_navigation': '../partials/_navigation',
				'_mobile-navigation': '../partials/_mobile-navigation',
				'_footer': '../partials/_footer',
				'_project-summary': '../partials/_project-summary',
				'_latest-build': '../partials/_latest-build',
				'_tabs-header': '../partials/_tabs-header',
				'_table-listing-nav': '../partials/_table-listing-nav',
				'_build-summary': '../partials/_build-summary',
			}
		});
	},

	// TEMPORARY - Render Index View
	twproject: function(req, res) {
		res.view({ 
			partials: {
				'_header': '../partials/_header',
				'_page-cap': '../partials/_page-cap',
				'_search': '../partials/_search',
				'_top-projects': '../partials/_top-projects',
				'_info-grid': '../partials/_info-grid',
				'_share-bar': '../partials/_share-bar',
				'_footer-links': '../partials/_footer-links',
				'_navigation': '../partials/_navigation',
				'_mobile-navigation': '../partials/_mobile-navigation',
				'_footer': '../partials/_footer',
				'_project-summary': '../partials/_project-summary',
				'_latest-build': '../partials/_latest-build',
				'_tabs-header': '../partials/_tabs-header',
				'_table-listing-nav': '../partials/_table-listing-nav',
				'_build-summary': '../partials/_build-summary',
			}
		});
	},

	// TEMPORARY - Render Index View
	twbuild: function(req, res) {
		res.view({ 
			partials: {
				'_header': '../partials/_header',
				'_page-cap': '../partials/_page-cap',
				'_search': '../partials/_search',
				'_top-projects': '../partials/_top-projects',
				'_info-grid': '../partials/_info-grid',
				'_share-bar': '../partials/_share-bar',
				'_footer-links': '../partials/_footer-links',
				'_navigation': '../partials/_navigation',
				'_mobile-navigation': '../partials/_mobile-navigation',
				'_footer': '../partials/_footer',
				'_project-summary': '../partials/_project-summary',
				'_latest-build': '../partials/_latest-build',
				'_tabs-header': '../partials/_tabs-header',
				'_table-listing-nav': '../partials/_table-listing-nav',
				'_build-summary': '../partials/_build-summary',
			}
		});
	},

	// Redirect to the equivalent client-side route
	redirect: function(req, res) {
		res.redirect("/#"+req.originalUrl);
	},
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SiteController)
   */
  _config: {}

  
};
