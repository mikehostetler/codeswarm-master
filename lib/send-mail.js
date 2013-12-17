var nodemailer = require("nodemailer"),
	sendMail;

/**
 * Sends mail through Nodemailer #####################################
 */

sendMail = function (mailOptions) {
	// Setup transport with app mailer configuration
	var transport = nodemailer.createTransport("SMTP", config.app.mailer);

	// Send notifation email
	transport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log("Message sent: " + response.message);
		}
		// Close transport
		transport.close();
	});
};

module.exports = sendMail;
