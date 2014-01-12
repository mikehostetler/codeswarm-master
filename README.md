# Vouch-CD

Vouch is a simple, [NodeJS](http://www.nodejs.org) server that provides continuous
integration and deployment/staging.

## Getting Started

Installation of Vouch is meant to be very simple, there is no database to configure
and once running administration is extremely minimal.

### System Installation & Startup

1. Clone the repo to your server
2. Run `npm install` to pull the dependencies
3. Run `grunt` to build the application
4. Rename `/config.json.example` to `/config.json`
5. Edit any settings in `/config.json`, specifically change the default `token`
6. (Optional) Copy the contents of your servers pub-key into `/deploy_key`
7. Start the service via `node index.js`

You can then navigate to the dashboard by opening the following in your browser:

```html
http(s)://yourserver.com:{BUILD-PORT}/
```

Once logged in you can setup a project by clicking the *New Project* button. The
creation process is as simple as putting in the address of the Git repo. The system
will automatically generate the Deploy Hook URL when creating the project.

You can also set which branch the server should build from as well as an (optional)
username and password for viewing the build.

### Project Setup

The Deploy Hook URL generated when the project is created can be added to the
[Github Post-Receive Hooks](https://help.github.com/articles/post-receive-hooks)
and the Deploy Key added to the project's [Github Deploy Keys](https://help.github.com/articles/managing-deploy-keys#deploy-keys).
This will allow the project to trigger the build process whenever a push is made
to the repository.

In order for projects to build properly, they must have a `.vouch.json` config file
in their root. An example of this file is:

```json
{
    "dir": "/dist",
    "default": "index.html",
    "run": [
        "npm install",
        "grunt"
    ],
    "notify": [
        "jsmith@email.com",
        "fbar@email.com"
    ]
}
```

This file serves several important purposes:

**The `dir` and `default` establish the staging configuration**

When the build is successful it will be available through the browser at
`http://yourserver.com/view/PROJECT_NAME` and the server will load `dir` as the
root and `default` as the default file to serve.

**The `run` commands are fired during build**

These commands will be called by the system once the repository is successfully
pulled and setup.

**The `notify` array contains those working on the project**

Not only will these email addresses recieve notifications on build failures, they
are also able to access the logs for this (and any other projects) they are listed
on.

### Mail Configuration

In order to receive email notifications from the system, the following must be
added to the `/config.json` under the `app` properties:

```json
    "mailer": {
        "host": "smtp.yourserver.com",
        "secureConnection": true,
        "port": 465,
        "auth": {
            "user": "user@yourserver.com",
            "pass": "password"
        }
    }
```
