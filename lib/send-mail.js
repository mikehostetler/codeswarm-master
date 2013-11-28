var nodemailer = require("nodemailer");

var sendMail = function (mailOptions) {
    var transport = nodemailer.createTransport("SMTP", config.app.mailer);

    // Send notifation email
    transport.sendMail(mailOptions, function(error, response){
        if (error) {
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
        transport.close();
    });
};

module.exports = sendMail;