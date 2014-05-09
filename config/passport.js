/**
 * Passport configuration
 *
 * This if the configuration for your Passport.js setup and it where you'd
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {

  local: {
    strategy: require('passport-local').Strategy
  },

	/*
  twitter: {
    name: 'Twitter',
    protocol: 'oauth',
    strategy: require('passport-twitter').Strategy,
    options: {
      consumerKey: 'your-consumer-key',
      consumerSecret: 'your-consumer-secret'
    }
  },
	*/

  github: {
    name: 'GitHub',
    protocol: 'oauth2',
    strategy: require('passport-github').Strategy,
		scope: ['repo'],
    options: {
      clientID: 'fa7ee9fa1adee8720bd8',
      clientSecret: '2743f5dfcc1e79e1d54c54840e16e830b63da328',
    }
  },

  bitbucket: {
    name: 'BitBucket',
    protocol: 'oauth',
    strategy: require('passport-bitbucket').Strategy,
    options: {
      consumerKey: 'GMTSBMrLqDP36NZRT6',
      consumerSecret: 'auGM6EjgXHKbxJfvN3GESFsfE774gsLD',
    }
  },

	/*
  facebook: {
    name: 'Facebook',
    protocol: 'oauth2',
    strategy: require('passport-facebook').Strategy,
    options: {
      clientID: 'your-client-id',
      clientSecret: 'your-client-secret'
    }
  },

  google: {
    name: 'Google',
    protocol: 'openid',
    strategy: require('passport-google').Strategy
  }
	*/

};
