# Node Deploy

A simple server for building and deploying apps through Node.

## Installation & Startup

Run the `npm install` command in the project directory to install all dependencies. The application 
itself can be started by calling `node index.js`.

## Usage

The server will build a project from a Git repo when the URL is triggered:

```
http(s)://yourserver.com:[APP-PORT]/[PROJECT-NAME]
```

### Configuration

This trigger will use 2 configurations, the first is the `config.json` file on the server:

```json
{
    "[PROJECT-NAME]" : {
        "dir": "[PROJECT-DIRECTORY]",
        "repo": "[PROJECT-REPO]"
    },
    ...
}
```

* `PROJECT-NAME` is a reference to the project (and the trigger)
* `PROJECT-DIRECTORY` is the directory (inside `/builds`) where the project will reside
* `PROJECT-REPO` is the SSH URL to the repository

The second configration is in the project repository itself in `/.deploy.json`:

```json
{
    "dir": "[DIST-DIRECTORY]",
    "default: "[DEFAULT-FILE]",
    "run": [
        "[COMMAND]",
        "[COMMAND]",
        ...
    ]
}
```

* `DIST-DIRECTORY` is the directory of the build to run, leave empty for root
* `DEFAULT-FILE` is the default file to serve when serving the build over http
* `COMMAND` is any task or command to run (in order) in order to build the project

### Logging

All steps of the build process are stored in a log file located in the `logs` directory 
in a folder matching the server config's `PROJECT-NAME`. The log file's name is returned 
in the HTTP response when the build is triggered.

