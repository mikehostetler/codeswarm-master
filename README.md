# CodeSwarm

## Install

Checkout plugin `codeswarm-node`:

```
$ cd projects
$ git clone git@github.com:CodeSwarm/codeswarm-node.git
$ cd codeswarm-node
$ npm link
```

Link it:

```
$ cd  projects/codeswarm
$ npm link codeswarm-node
```

## Run

Start CodeSwarm in dev mode (uses nodemon to restart when JS changes are made):

```bash
$ npm run mon
```


## CouchDB Setup

You have to create the admin user with the `admin` password. You can override this with the COUCHDB_USERNAME and COUCHDB_PASSWORD env vars though.

To add the couchdb admin user go to futon (the couchdb admin interface), and click on the `Setup more admins` on the bottom right side.
On the couchdb configuration, set couchdb_httpd_auth=> allow_pesistent_cookies to true
Make sure the admin user is listed on the config `admins` section

Using a different user on the fronted than the admin user and also the persistent cookie session should prevent you from being logged out.

### Session timeout

To define / redefine the session timeout you need to specify the `timeout` parameter of the `couch_httpd_auth` section of the configuration, in seconds:

![session timeout](docs/images/session_timeout.png)

### ENV Variables

* COUCHDB_URL - couchdb url, defaults to "http://localhost:5984".
* COUCHDB_USERNAME - couchdb username, defaults to "admin".
* COUCHDB_PASSWORD - couchdb password, defaults to "admin".
* PORT - http listening port, defaults to 1337.
* GITHUB_CLIENT_ID
* GITHUB_CLIENT_SECRET
* GITHUB_CALLBACK_URL - github callback, default to "http://localhost:1337/tokens/github/callback"
* VOUCH_REMOTE or CODESWARM_REMOTE - remotified, defaults to "false".