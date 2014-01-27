var fs  = require("fs");
var Joi = require('joi');

/// get

exports.get = get;
function get() {
  var config = JSON.parse(fs.readFileSync("config.json"));
  validate(config);
  return config;
}


/// set

exports.set = set;
function set(data) {
	fs.writeFileSync("config.json", JSON.stringify(data, null, 4));
}


/// validate

var schema = Joi.object({
  app: Joi.object({
    port: Joi.number().required(),
    logs: Joi.string().required(),
    builds: Joi.string().required(),
    mailer: Joi.object().required(),
    temp: Joi.string().required()
  }),
  couchdb: Joi.object({
    url: Joi.string().required(),
    admin: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required()
    }).required()
  })
});

var validationOptions = {
  allowUnknown: true
};

function validate(config) {
  var err = Joi.validate(config, schema, validationOptions);
  if (err) {
    err.message = 'Error parsing config file: ' + err.message;
    throw err;
  }
}