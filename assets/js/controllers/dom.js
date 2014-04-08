define([
		"jquery",
		"handlebars",
		"underscore",
		"controllers/timestamp",
		"text!templates/header.tpl",
		"text!templates/signup.tpl",
		"text!templates/login.tpl",
		"text!templates/menu.tpl",
		"text!templates/projects.tpl",
		"text!templates/projects_table.tpl",
		"text!templates/project.tpl",
		"text!templates/builds.tpl",
		"text!templates/logview.tpl",
		"text!templates/tokens.tpl",
		"text!templates/github_repos.tpl",
		"text!templates/plugins.tpl",
		"text!templates/tags.tpl",
		"text!templates/builds_by_tag.tpl"
	],
	function ($, Handlebars, _, timestamp, header, signup, login, menu, projects, projects_table, project, builds, logview, tokens, github_repos, plugins, tags, builds_by_tag) {
		var dom;

		dom = {

			loaded: false,

			// Cached els
			$window: null,
			$header: null,
			$menu: null,
			$globalNav: null,
			$menubutton: null,
			$shadowblock: null,
			$main: null,
			$notification: null,

			// Named els
			login:  "#login",
			signup: "#signup",

			init: function () {

				// Cache elements
				this.$window = $(window);
				this.$header = $("header");
				this.$menu = $("aside");
				this.$main = $("#main");
				this.$notification = $("#notification");
				this.$body = $("body");
				this.$document = $(document);

				// Initialize methods
				this.loadHeader();
				this.floatHeader();

			},

			/**
			 * Change the body class
			 */
			setBodyClass: function (c) {
				$("body").removeClass().addClass(c);
			},

			/**
			 * Load the header contents
			 */
			loadHeader: function (auth) {
				var template = Handlebars.compile(header),
					html = template({
						auth: auth
					});
				this.$header.html(html);
				// if (auth) {
				// this.bindMenu();
				// } else {
				// this.hideMenu();
				// }
				// this.$shadowblock = this.$header.find("#shadow-block");

				// Fire globalNav
				this.globalNav();
			},

			/**
			 * Show/hide global navigation
			 */
			globalNav: function () {
				var self = this;

				$(".nav-trigger").click(function (e) {
					e.stopPropagation();

					if (!self.$body.hasClass("global-nav--open")) {
						self.$body.addClass("global-nav--open");
					} else {
						self.$body.removeClass("global-nav--open");
					}
				});

				self.$document
					.on("click", function () {
						self.$body.removeClass("global-nav--open");
					})
					.on("click", ".global-nav", function (e) {
						e.stopPropagation();
					});
			},

			/**
			 * Load the menu contents
			 */
			loadMenu: function () {
				var self = this,
					template = Handlebars.compile(menu),
					html = template({});
				this.$menu.html(html);
				this.$menu.on("click", function () {
					self.hideMenu();
				});
				this.$main.on("click", function () {
					self.hideMenu();
				});
			},

			/**
			 * Hide the menu
			 */
			hideMenu: function () {
				this.$menu.removeClass("menu-open");
				this.$shadowblock = this.$header.find("#shadow-block");
				this.$shadowblock.removeClass("menu-open");
			},

			/**
			 * Load the signup form
			 */
			loadSignup: function () {
				this.loaded = false;
				this.$main
					.html(signup)
					.find("input:first-of-type")
					.focus();
				this.loadHeader(false);
			},

			/**
			 * Load the login form
			 */
			loadLogin: function () {
				this.loaded = false;
				this.$main
					.html(login)
					.find("input:first-of-type")
					.focus();
				this.loadHeader(false);
			},

			/**
			 * Get input from form element by name
			 */
			getValue: function (form, name) {
				return form.find("[name=\"" + name + "\"]").val();
			},

			/**
			 * Load the app
			 */
			loadApp: function () {
				if (!this.loaded) {
					this.loadHeader(true);
					this.loadMenu();
					this.loaded = true;
				}
			},

			/**
			 * Load projects
			 */
			loadProjects: function (data, controller, restricted) {
				var self = this;
				var search;

				var template = Handlebars.compile(projects);
				var projectsTableTemplate = Handlebars.compile(projects_table);
					html = template({
						projects: projectsTableTemplate({
							projects: data,
							restricted: restricted || false
						}),
						restricted: restricted || false
					});
				this.$main.html(html);

				setupProjectList();

				this.$main.find('#project-search').keyup(_.debounce(search, 250));

				function search() {
					var $this = $(this);
					search = $this.val();
					controller.search(search, searchResults);
				}

				function searchResults(projects) {
					self.$main.find('#project-list').html(projectsTableTemplate({
						projects: projects,
						restricted: restricted,
						search: !! search
					}));
					setupProjectList();
				}

				function setupProjectList() {
					// Watch for build trigger
					self.$main.find(".project-run-build").click(function () {
						// Spin teh icon!
						$(this).find("i").addClass("fa-spin");
						var project = $(this).data("project");
						controller.runBuild(project);
					});
				}

			},

			/**
			 * Update project status
			 */
			updateProject: function (project) {
				var statusEl = this.$main.find("[data-status=\"" + project.id + "\"]");
				var timestampEl = this.$main.find("[data-timestamp=\"" + project.id + "\"]");
				var lightEl = this.$main.find("[data-light=\"" + project.id + "\"]");

				var lastBuild = project.ended_at || project.started_at;

				switch (project.state) {
				case "passed":
					updateStatus('Passed', 'green');
					lightEl.find("i").removeClass("fa-spin");
					timestampEl.html('Last Build: ' + (project.ended_at || 'Never'));
					break;
				case "failed":
					updateStatus('Failed', 'red');
					lightEl.find("i").removeClass("fa-spin");
					timestampEl.html('Last Build: ' + (project.ended_at || 'Never'));
					break;
				case "running":
					updateStatus('Running', 'yellow');
					lightEl.find("i").addClass("fa-spin");
					timestampEl.html('Started at: ' + (project.started_at));
					// Don't keep replacing, just check state
					break;
				}

				function updateStatus(expression, color) {
					statusEl.html("<br><a href=\"#/" + project + "/builds/" + project.last_build + "\" title=\"Build " + expression + "\"><i class=\"fa fa-circle " + color + "\"></i></a>");
				}
			},

			/**
			 * Update active log
			 */
			updateLog: function (log, content) {
				var el = this.$main.find("[data-log=\"" + log + "\"]"),
					curScroll = $("body").scrollTop(),
					docHeight = ($(document).height() - $(window).height());
				el.append(content);
				// Scroll if on view-log and "locked" to bottom of scrolling window
				if ($("body").hasClass("view-log") && (curScroll + 30) > docHeight) {
					$("html, body").scrollTop($(document).height());
				}
			},

			/**
			 * Load individual project (config)
			 */
			loadProject: function (data, controller) {
				var self = this,
					template = Handlebars.compile(project),
					html = template(data);
				this.$main.html(html);

				// Validate repo
				var validateRepo = function (str) {
					var name = str.split("/");
					// Check extension
					if (name[name.length - 1].indexOf(".git") !== -1) {
						return name[name.length - 1].replace(".git", "");
					}
					return false;
				};

				// Handle form submission
				$("#project-config").submit(function (e) {
					e.preventDefault();
					var name,
						data = $(this).serializeObject();

					if (validateRepo(data.repo))
						controller.saveProject(data);

				});

				// Handle delete request
				this.$main.find("#project-delete").click(function () {
					// Hide delete button
					$(this).hide();
					// Show confirm/cancel
					self.$main.find("#project-confirm-delete, #project-cancel-delete").show();
				});

				// Confirm and process delete
				this.$main.find("#project-confirm-delete").click(function () {
					controller.deleteProject(self.$main.find("input[name=\"id\"]").val());
				});

				// Cancel delete
				this.$main.find("#project-cancel-delete").click(function () {
					// Show delete button
					self.$main.find("#project-delete").show();
					// Hide confirm/cancel
					self.$main.find("#project-confirm-delete, #project-cancel-delete").hide();
				});
			},

			/**
			 * Project Plugin Config
			 */
			loadPluginConfig: function(project, pluginSchema, save) {
				var self = this;
				var template = Handlebars.compile(plugins);

				var projectPluginsConfig = project.plugins || {};

				var _plugins = Object.keys(pluginSchema).map(function(plugin) {
					var projectPluginConfig = projectPluginsConfig[plugin] || {};
					var attributes = pluginSchema[plugin];

					attributes.forEach(function(attribute) {
						attribute.value = projectPluginConfig[attribute.name];
						if (attribute.type == 'selectMultiple') {
							attribute.from = attribute.from.map(function(possibleValue) {
								return {
									value: possibleValue,
									selected: attribute.value && attribute.value.indexOf(possibleValue) >= 0
								};
							});
						} else if (attribute.type == 'selectOne') {
							attribute.from = attribute.from.map(function(possibleValue) {
								return {
									value: possibleValue,
									selected: attribute.value == possibleValue
								};
							});
						}
					});

					return {
						name: plugin,
						attributes: attributes
					};
				});

				var html = template({
						project: project,
						plugins: _plugins
					});
				this.$main.html(html);

				this.$main.find('form').submit(function(e) {
					e.preventDefault();
					var form = $(this).serializeObject();
					var config = {};
					for(var key in form) {
						var split = key.split('/');
						var plugin = split[0];
						var name = split[1];
						var value = form[key];
						if (! config[plugin]) config[plugin] = {};
						config[plugin][name] = value;
					}

					save(config);
				});
			},

			/**
			 * Screen for project builds by tag
			 */
			loadBuildTags: function(project, buildsByTag, runBuild) {
				var template = Handlebars.compile(builds_by_tag);

				var tagsByTag = {};
				var tags = [];

				Object.keys(buildsByTag).forEach(function(tag) {
					var tagObj = tagsByTag[tag];
					if (! tagObj) {

						tagObj = tagsByTag[tag] = {
							name: tag,
							builds: []
						};
						tags.push(tagObj);
					}

					tagObj.builds = tagObj.builds.concat(buildsByTag[tag] || []);
				});

				var html = template({
					project: project,
					tags: tags
				});

				this.$main.html(html);

				// Watch for build trigger
				this.$main.find(".project-run-build").click(function () {
					var $this = $(this);
					// Spin teh icon!
					$this.find("i").addClass("fa-spin");
					var project = $this.data("project");
					var tag = $this.data("tag");
					runBuild(project, tag);
				});
			},

			/**
			 * Screen for project tags config
			 */
			loadTags: function(project, _tags, star, unstar, saveContent) {
				if (! _tags) tags = [];

				var self = this;

				var template = Handlebars.compile(tags);
				console.log('loadTags', arguments);
				var html = template({
					project: project,
					tags: _tags
				});

				this.$main.html(html);

				this.$main.find('.star').click(function() {
					$this = $(this);
					var tag = $this.attr('data-tag');
					var starred = $this.attr('data-starred') == 'true';
					var fn = starred ? unstar : star;
					fn.call(null, tag, function() {
						$this.attr('data-starred', starred ? 'false' : 'true');
						if (starred) {
							$this.removeClass('yellow');
						} else {
							$this.addClass('yellow');
						}
					});
				});

				this.$main.find('button.edit').click(editButtonClicked);

				function editButtonClicked() {
					var $this = $(this);

					var tag = $this.attr('data-tag');
					var tagObject = findTag(tag);

					var labelEditor = $('<input type="text" maxlength="50" value="' + htmlEncode(tagObject.label || '') + '">');
				  var labelPlace = self.$main.find('.label[data-tag="' + tag +'"]');
				  var oldLabel = labelPlace.html();
				  labelPlace.html(labelEditor);

					var descriptionEditor = $('<textarea>' + htmlEncode(tagObject.description || '') + '</textarea>');
				  var descriptionPlace = self.$main.find('.description[data-tag="' + tag +'"]');
				  var oldDescription = descriptionPlace.html();
				  descriptionPlace.html(descriptionEditor);

				  var buttonPlace = $this.parent();
				  var oldButtons = buttonPlace.children();

				  var saveButton = $('<button>Save</button>');
				  $this.replaceWith(saveButton);
				  var cancelButton = $('<button>Cancel</button>');
				  saveButton.after(cancelButton);

				  saveButton.click(function() {
				 	  var label = labelEditor.val();
				 	  var description = descriptionEditor.val();
				 	  saveContent(tag, { label: label, description: description}, savedContent);

				 	  function savedContent() {
				 	  	tagObject.label = label;
				 	  	tagObject.description = description;

				 	  	labelPlace.text(label);
				 	  	descriptionPlace.text(description);
				 	  	buttonPlace.html(oldButtons);
				 	  	oldButtons.click(editButtonClicked);
				 	  }

				  });


				  cancelButton.click(function() {
				  	labelPlace.html(oldLabel);
				  	descriptionPlace.html(oldDescription);
				  	buttonPlace.html(oldButtons);
				  	oldButtons.click(editButtonClicked);
				  });

				}

				function findTag(tag) {
					console.log('findTag', tag);
					var t;
					for(var i = 0 ; i < _tags.length; i ++) {
						t = _tags[i];
						if (t.name == tag) return t;
					}
				}
			},

			/**
			 * Request Github Token
			 */
			requestGithubToken: function() {
				this.$main.html(tokens);
			},


			/**
			 * List Github Repos
			 */
			listGithubRepos: function(repos, user, addCb, removeCb, directAdd) {

				var repoMapByGitUrl = {};

				repos.forEach(function(repo) {
					repoMapByGitUrl[repo.github.git_url] = repo;
				});

				var template = Handlebars.compile(github_repos),
					html = template({
						repos: repos,
						user: user
					});
				this.$main.html(html);

				this.$main.find('.add-repo').click(function() {
					var $this = $(this);
					var gitUrl = $this.attr('data-target');
					var repo;
					if (gitUrl) repo = repoMapByGitUrl[gitUrl];
					if (repo) addCb(repo);
				});

				this.$main.find('.remove-repo').click(function() {
					var $this = $(this);
					var id = $this.attr('data-target');
					removeCb(id);
				});

				if (user.isAdmin) {
					this.$main.find('.direct-add').click(function() {
						directAdd();
					});
				}
			},

			/**
			 * Load builds
			 */
			loadBuilds: function (project, data) {
				var template = Handlebars.compile(builds),
					html = template({
						project: project,
						builds: data
					});
				this.$main.html(html);
			},

			/**
			 * Load log output
			 */
			loadLogOutput: function (project, build) {
				var template = Handlebars.compile(logview),
					html = template(build);
				this.$main.html(html);
			},

			/**
			 * Applies floating property to fixed header
			 */
			floatHeader: function () {

				var self = this;

				self.$window.scroll(function () {
					if ($(this).scrollTop() > 0) {
						self.$header.addClass("floating");
					} else {
						self.$header.removeClass("floating");
					}
				});
			},

			/**
			 * Opens and closes menu
			 */
			bindMenu: function () {
				var self = this;
				self.$header.off().on("click", ".menu-button", function () {
					self.$menu.toggleClass("menu-open");
					self.$shadowblock.toggleClass("menu-open");
				});
			},

			/**
			 * Shows notification pop-up
			 */
			showNotification: function (type, message) {
				var self = this;
				self.$notification.addClass(type).children("div").html(message);
				// Auto-close after timeout
				var closer = setTimeout(function () {
					self.$notification.removeClass(type);
				}, 3000);
				// Bind close button
				self.$notification.find("a").click(function () {
					self.$notification.removeClass(type);
					window.clearTimeout(closer);
				});
			},

			// Proxy for showNotifcation
			showError: function (message) {
				this.showNotification("error", message || 'Unknown Error');
			},

			showXhrError: function (xhr) {
				var message = xhr.responseJSON && xhr.responseJSON.message ||
				  xhr.responseText ||
				  "Unknown error";

				dom.showError(message);
			},

			// Proxy for showNotification
			showSuccess: function (message) {
				this.showNotification("success", message);
			}
		};

		Handlebars.registerHelper("compare", function (lvalue, rvalue, options) {
			var result,
				operator,
				operators;

			if (arguments.length < 3) {
				throw new Error("Handlerbars Helper compare needs 2 parameters");
			}

			operator = options.hash.operator || "==";

			operators = {
				"===": function (l, r) {
					return l === r;
				},
				"!==": function (l, r) {
					return l !== r;
				},
				"<": function (l, r) {
					return l < r;
				},
				">": function (l, r) {
					return l > r;
				},
				"<=": function (l, r) {
					return l <= r;
				},
				">=": function (l, r) {
					return l >= r;
				},
				"typeof": function (l, r) {
					return typeof l === r;
				}
			};

			if (!operators[operator]) {
				throw new Error("Handlerbars Helper compare does not know the operator " + operator);
			}

			result = operators[operator](lvalue, rvalue);

			if (result) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}

		});

		Handlebars.registerHelper("key_value", function (obj, options) {
			var buffer = "",
				key;

			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					buffer += options.fn({
						key: key,
						value: obj[key]
					});
				}
			}

			return buffer;
		});

		Handlebars.registerHelper('select', function( value, options ){
      var $el = $('<select />').html( options.fn(this) );
      $el.find('[value=' + value + ']').attr({'selected':'selected'});
      return $el.html();
    });

		$.fn.serializeObject = function () {
			"use strict";

			var result = {},
				extend;

			extend = function (i, element) {
				var node = result[element.name];

				if ("undefined" !== typeof node && node !== null) {
					if ($.isArray(node)) {
						node.push(element.value);
					} else {
						result[element.name] = [node, element.value];
					}
				} else {
					result[element.name] = element.value;
				}
			};

			$.each(this.serializeArray(), extend);
			return result;
		};

		return dom;

	});

function htmlEncode(value){
  return $('<div/>').text(value).html();
}