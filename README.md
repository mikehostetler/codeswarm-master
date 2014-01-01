# Vouch-CD

A simple continuous integration and deployment server for building and deploying apps through NodeJS.

## Installation & Startup

Run the `npm install` command in the project directory to install all dependencies, then `grunt` to 
build the application. The application itself can be started by calling `node index.js`. It is recommended 
you use [forever](https://github.com/nodejitsu/forever) for running the server long term.

## Usage

The server will build a project from a Git repo when the URL is triggered with a `POST`:

```html
http(s)://yourserver.com:{APP-PORT}/deploy/{PROJECT-NAME}
```

### Configuration

**Server Configuration**

The server uses `config.json` to set application runtime params as well as build projects.

The first section is the `app` configuration:

```json
"app": {
    "port": 8080,
    "logs": "./logs/",
    "builds": "./builds/",
    "mailer": {
        "host": "smtp.yourserver.com",
        "secureConnection": true,
        "port": 465,
        "auth": {
            "user": "user@yourserver.com",
            "pass": "password"
        }
    },
    "tokens": [
        "1234567890"
    ]
}
```

Which sets the port, log directory, build directory, mailer configuration and UI access tokens.

Add your server's public key to the `/deploy_key` file to make the deploy key available in the UI.

The second section is `projects` which sets the parameters for build projects:

```json
"projects": {
    "{PROJECT-NAME}" : {
        "dir": "{PROJECT-DIRECTORY}",
        "repo": "{PROJECT-REPO}",
        "auth": {
            "user": "{VIEW-USER}",
            "pass": "{VIEW-PASS}"
        }
    },
    {...}
}
```

* `PROJECT-NAME` is a reference to the project (and the trigger)
* `PROJECT-DIRECTORY` is the directory (inside `/builds`) where the project will reside
* `PROJECT-REPO` is the SSH URL to the repository
* HTTP Build-View Authentication, set to `false` for no authentication
    * `VIEW-USER` is the username for accessing the completed build
    * `VIEW-PASS` is the password for accessing the completed build

The `projects.{PROJECT-NAME}` object is also automatically populated with a `state` child object 
once (and every subsequent time) a project is run through the build/deploy process. The `state` 
child object contains information about the last build like the status, scripts run, and log name.

**Project Configuration**

The second configration is in the project repository itself in the `.vouch.json` file:

```json
{
    "dir": "{DIST-DIRECTORY}",
    "default": "{DEFAULT-FILE}",
    "run": [
        "{COMMAND}",
        "{COMMAND}",
        ...
    ],
    "notify": [
        "{USER_EMAIL}",
        "{USER_EMAIL}",
        ...
    ]
}
```

* `DIST-DIRECTORY` is the directory of the build to run, leave empty for root
* `DEFAULT-FILE` is the default file to serve when serving the build over http
* `COMMAND` is any task or command to run in order to build the project
* `USER_EMAIL` is any email address you would like to recieve a notification if the build fails

### Logging

All steps of the build process are stored in a log file located in the `logs` directory 
in a folder matching the server config's `PROJECT-NAME`. The log file's name is returned 
in the HTTP response when the build is triggered.

### Accessing the Dashboard

To access the system from your web browser, go to:

```html
http(s)://yourserver.com:{BUILD-PORT}/dashboard/
```

The token for access will be in the `tokens` section of the config.

### Accessing Builds

Once a build passes it is served through Express at the following URL:

```html
http(s)://yourserver.com:{BUILD-PORT}/view/{PROJECT-NAME}
```

It runs off the configuration set in the `.vouch.json` file to load the appropriate distribution 
directory and default file.

If the `auth` object in `config.json` is set for the project, the user will be prompted to enter a username and password.

