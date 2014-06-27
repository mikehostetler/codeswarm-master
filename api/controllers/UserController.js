/**
 * UserController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
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

  /**
   * `GET /user`
	 * Gets the current user from the session, used as a "Logged In" heartbeat
   */
	find: function(req, res) {
		var username = req.param('id');

		if(username === undefined && req.user === undefined) {
			res.json(401, {message: 'No session'});
			return;
		}

		// Grab the username from the session
		if(username === undefined) {
			username = req.user.username;
		}

		User.findOne({username: username}, function (err, user) {
			if (err) res.json(401, {message: 'Could not find User'});
			else if (user == undefined) res.json(401, {message: 'Could not find User'});
			else {
				user = User.toJSON(user);
				User.getTokens(user,function(err, user) {
					if (err) res.json(401, {message: 'Error retrieving Tokens'});

					res.json({ message: "Successfully found user", user: user });
				});
			}
		});
	},

  /**
   * `POST /user`
   */
  update: function (req, res) {
		var username = req.param('id');

		if(username === undefined) {
			username = req.user.username;
		}

		User.findOne({id: username},function(err, user) {
					if (err) {
						res.send(err.status_code || 500, err);
					}

					if(req.param('type') !== undefined) {
						user.type = req.param('type');
					}

					if(req.param('email') !== undefined) {
						user.email = req.param('email');
					}

					user.save(function(err) {
						if (err) res.send(err.status_code || 500, err);
						else res.json({ message: "Successfully saved user", user: User.toJSON(user)});
					});
				}
			);
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionController)
   */
  _config: {
		rest: false // Turn off automatic REST routes
  }
};
