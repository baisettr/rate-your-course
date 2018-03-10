const nodemailer = require('nodemailer');

var mailTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: '',
        pass: ''
    },
    port: 465,      //465 if secure   //587  if unsecure
    secure: true,
    /*
        auth: {
            user: '',
            pass: '$',
        }
    */
});

function sendMail(emailFrom, emailTo, emailSubject, emailContent, callback) {
    if (emailTo.slice(-10) == '@dummy.com') {
        callback(null);
    }

    mailTransport.sendMail({
        from: 'emailFrom',
        to: emailTo,
        subject: emailSubject,
        text: emailContent,
    }, function (err) {
        callback(err);
    });
}

module.exports = { sendEmail: sendMail }
