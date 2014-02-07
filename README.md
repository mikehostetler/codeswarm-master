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