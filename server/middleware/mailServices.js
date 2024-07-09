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
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: winnerEmail.email,
        subject: 'Congratulations🥳🎉! You have won a gift!',
        text: `Dear Winner,\n\nCongratulations! You have won the gift: ${giftName}.\n\nBest Regards,\nChinese sale website`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
         console.log('Error sending email:', error);
    }
}
async function sendOrderEmail(recipientEmail, orderSummary, totalPrice) {
    const orderItems = orderSummary.map(item => `${item.name}: $${parseFloat(item.price).toFixed(2)}`).join('\n');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: 'Order Summary - Your Recent Purchase',
        text: `Dear Customer,Thank you for your order!
         Here is a summary of your recent purchase:${orderItems}
        Total Price: $${parseFloat(totalPrice).toFixed(2)}
        We appreciate your business and hope you enjoy your new items!
        Best Regards,
        Your Company Name`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Order summary email sent successfully');
    } catch (error) {
         console.log('Error sending email:', error);
    }
}
async function sendFundraiserEmail(email, status) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Status changed❗',
        text: `Dear Fundraiser,\n\ You status have been change to: ${status}.\n\nBest Regards,\nChinese sale website`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
         console.log('Error sending email:', error);
    }
}

module.exports = { sendWinnerEmail, sendOrderEmail,sendFundraiserEmail };