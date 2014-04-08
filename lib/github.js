var request  = require('request');
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

passport.use(new GithubStrategy({
  clientID:     process.env.GITHUB_CLIENT_ID     || '38b4d7cbf60a13e29a2c',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || 'df305f1f836c81d2332e1d12f9a85b2d4faca783',
  callbackURL:  process.env.GITHUB_CALLBACK_URL  || 'http://localhost:1337/tokens/github/callback',
  scope: ['repo'],
  passReqToCallback: true
}, verify));

exports.authenticate = passport.authenticate('github');

exports.callback = passport.authenticate('github');

function verify(req, accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    req.session.token = accessToken;
    req.session.remoteUsername = profile.username;
    done(null, req.session.username());
  });
}

/// tags

exports.tags = getTags;

function getTags(project, cb) {

  var owner = project.owners && project.owners[0];
  if (! owner) return cb(new Error('project needs an owner'));

  var token;
  var tags = [];

  User.tokenFor(owner, 'github', gotToken);

  function gotToken(err, _token) {
    if (err) return cb(err);
    if (! _token) return cb(new Error('user has no token'));
    token = _token;
    _getTags(1);
  }

  function _getTags(page) {
    var options = {
      headers: {
        'Authorization': 'token ' + token.token,
        'User-Agent': 'codeswarm,request,node.js'
      },
      uri: 'https://api.github.com/repos/' + project.id + '/tags',
      qs: {
        page: page,
        per_page: 100
      },
      json: true
    };

    request(options, gotTags);

    function gotTags(err, res, _tags) {
      if (err) return cb(err);
      if (res.statusCode != 200)
        return cb(new Error('Github API call returned status code ' + res.statusCode));

      if (_tags && _tags.length) {
        tags = tags.concat(_tags);
      }

      if (_tags && _tags.length == 100) {
        getTags(page + 1);
      } else cb(null, tags);
    }
  }

}


/// pull requests

exports.getPullRequests = getPullRequests;

function getPullRequests(project, token, cb) {

  var pullRequests = [];

  get(1);

  function get(page) {
    var options = {
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'codeswarm,request,node.js'
      },
      uri: 'https://api.github.com/repos/' + project + '/pulls',
      qs: {
        page: page,
        per_page: 100
      },
      json: true
    };

    request(options, gotPullRequests);

    function gotPullRequests(err, res, _pullRequests) {
      if(! err && res.statusCode != 200)
        err = new Error('Github status code response was ' + res.statusCode);

      if (err) cb(err);
      else {
        pullRequests = pullRequests.concat(_pullRequests);
        if (_pullRequests.length == 100) get(page + 1);
        else cb(null, pullRequests)
      }
    }

  }
}


/// getRepo

exports.getRepo = getRepo;

function getRepo(repo, token, cb) {
  var options = {
    headers: {
      'Authorization': 'token ' + token,
      'User-Agent': 'codeswarm,request,node.js'
    },
    uri: 'https://api.github.com/repos/' + repo,
    json: true
  };

  request(options, gotRepo);

  function gotRepo(err, res, repo) {
    if(! err && res.statusCode != 200)
      err = new Error('Github status code response was ' + res.statusCode);

    if (err) cb(err);
    else cb(null, repo);
  }
}


/// getReleases

exports.getReleases = getReleases;

function getReleases(repo, token, cb) {
  var releases = [];

  get(1);

  function get(page) {
    var options = {
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'codeswarm,request,node.js'
      },
      uri: 'https://api.github.com/repos/' + repo + '/releases'
    };


    request(options, gotReleases);

    function gotReleases(err, res, _releases) {
      if(! err && res.statusCode != 200)
        err = new Error('Github status code response was ' + res.statusCode);

      if (err) cb(err);
      else {
        releases = releases.concat(_releases);
        if (_releases.length == 100) get(page + 1);
        else cb(null, releases);
      }
    }

  }
}


/// getTags

exports.getTags2 = getTags2;

function getTags2(repo, token, cb) {
  var tags = [];

  get(1);

  function get(page) {
    var options = {
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'codeswarm,request,node.js'
      },
      uri: 'https://api.github.com/repos/' + repo + '/tags',
      qs: {
        page: page,
        per_page: 100
      },
      json: true
    };

    request(options, gotTags);

    function gotTags(err, res, _tags) {
      if(! err && res.statusCode != 200)
        err = new Error('Github status code response was ' + res.statusCode);

      if (err) cb(err);
      else {
        tags = tags.concat(_tags);
        if (_tags.length == 100) get(page + 1);
        else cb(null, tags);
      }
    }

  }
}


/// branches

exports.branches = getBranches;

function getBranches(project, cb) {

  var owner = project.owners && project.owners[0];
  if (! owner) return cb(new Error('project needs an owner'));

  var token;
  var branches = [];

  User.tokenFor(owner, 'github', gotToken);

  function gotToken(err, _token) {
    if (err) return cb(err);
    if (! _token) return cb(new Error('user has no token'));
    token = _token;
    getBranches(1);
  }

  function getBranches(page) {
    var options = {
      headers: {
        'Authorization': 'token ' + token.token,
        'User-Agent': 'codeswarm,request,node.js'
      },
      uri: 'https://api.github.com/repos/' + project.id + '/branches',
      qs: {
        page: page,
        per_page: 100
      },
      json: true
    };

    request(options, gotBranches);

    function gotBranches(err, res, _branches) {
      if (err) return cb(err);
      if (res.statusCode != 200)
        return cb(new Error('Github API call returned status code ' + res.statusCode));

      if (_branches && _branches.length) {
        branches = branches.concat(_branches);
      }

      if (_branches && _branches.length == 100) {
        getBranches(page + 1);
      } else cb(null, branches);
    }
  }
}