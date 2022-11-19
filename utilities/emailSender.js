const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // create transporter
    const transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '57fa2734be4c15',
            pass: '5212b84ed9ab05',
        },
    });
    // define email options
    const emailOptions = {
        from: 'Kacper Hanuszewicz <admin@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    // send email
    await transport.sendMail(emailOptions);
};

module.exports = sendEmail;
