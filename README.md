# Vouch-CD

## Install

Checkout plugin `vouch-node`:

```
$ cd projects
$ git clone git@github.com:BrowserSwarm/vouch-node.git
$ cd vouch-node
$ npm link
```

Link it:

```
$ cd  projects/vouch-cd
$ npm link vouch-node
```

## Run

Start Vouch-CD in dev mode (uses nodemon to restart when JS changes are made):

```bash
$ npm run mon
```


## CouchDB Setup

You have to create the admin user with the `admin` password. You can override this with the COUCHDB_USERNAME and COUCHDB_PASSWORD env vars though.

To add the couchdb admin user go to futon (the couchdb admin interface), and click on the `Setup more admins` on the bottom right side.
On the couchdb configuration, set couchdb_httpd_auth=> allow_pesistent_cookies to true
Make sure the admin user is listed on the config `admins` section

Using a different user on the fronted than the admin user and also the persistent cookie session should prevent you from being logged out.