const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendWinnerEmail(winnerEmail, giftName) {
    console.log(winnerEmail);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: winnerEmail.email,
        subject: 'Congratulations🥳🎉! You have won a gift!',
        text: `Dear Winner,\n\nCongratulations! You have won the gift: ${giftName}.\n\nBest Regards,\nYour Company Name`
    };
    console.log(mailOptions);

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}



module.exports = { sendWinnerEmail };