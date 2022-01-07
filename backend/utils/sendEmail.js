const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.REACT_APP_MY_HEROKU_BACKEND_URL,
            service: 'Gmail',
            port: 587,
            secure: true,
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.MY_EMAIL,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

exports.sendEmail = sendEmail;
