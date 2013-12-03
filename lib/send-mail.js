var nodemailer = require("nodemailer");

/**
 * Sends mail through Nodemailer #####################################
 */

var sendMail = function (mailOptions) {
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
