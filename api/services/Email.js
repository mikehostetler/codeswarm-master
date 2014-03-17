var Mailgun = require('mailgun').Mailgun;
var config = require('../../config/email');
var sender  = new Mailgun(config.mailgun.api_key);
var fs = require('fs');
var Handlebars = require('handlebars');

var templates = {
  forgot_password: loadEmailTemplate('forgot_password')
};

exports.sendSystemEmail = sendSystemEmail;

function sendSystemEmail(options, cb) {
  console.log('sendSystemEmail %j', options);
  var template = options.template;
  if (! options.template) return cb(new Error('need options.template'));

  template = templates[template];
  if (! template) return cb(new Error('no template named ' + options.template + ' found'));

  console.log('sendint email... (1)');
  sendEmail({
    from: config.from,
    to: options.to,
    subject: options.subject,
    body: template(options.data)
  }, cb);
}

function sendEmail(options, cb) {
  console.log('sendint email... (2)', options);
  sender.sendText(options.from, options.to, options.subject, options.body, sentEmail);

  function sentEmail(err) {
    if (err) cb(new Error('Error sending email. Provider message: ' + err.message));
    else cb();
  }
}

function loadEmailTemplate(name) {
  var path = __dirname + '/../../views/emails/' + name + '.handlebars';
  return Handlebars.compile(fs.readFileSync(path, 'utf8'));
}