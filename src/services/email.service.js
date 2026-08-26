require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Utility function to send registration email
async function sendRegistrationEmail(userEmail, name) {
    const subject = "🎉 Welcome to Backend Ledger – Your Journey Begins!";

    const text = `Hello ${name},

Welcome to Backend Ledger! We're thrilled to have you join our growing community.

Here’s what you’ll get with Backend Ledger:
- A secure and reliable platform to manage backend workflows.
- Easy-to-follow guides and documentation to help you get started.
- Continuous updates and improvements to make your experience smoother.
- Dedicated support whenever you need assistance.

🚀 Next Steps:
1. Log in to your account and explore the dashboard.
2. Check out our documentation for tips and best practices.
3. Start building and let Backend Ledger simplify your backend journey.

If you have any questions, reach out to our support team at support@backendledger.com.

Best regards,
The Backend Ledger Team
`;

    const html = `
    <p>Hello ${name},</p>
    <p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p>
    <p>Best regards,<br>The Backend Ledger Team</p>
  `;

    try {
        await sendEmail(userEmail, subject, text, html);
        console.log("Registration email sent successfully!");
    } catch (error) {
        console.error("Error sending registration email:", error);
    }
}

async function sendTransactionEmail(userEmail, name, amount, fromAccount, toAccount) {

    const subject = "💰 Transaction Alert – Your Recent Activity";
    const text = `Hello ${name},
We wanted to inform you about a recent transaction on your account.
Transaction Details:
- Amount: $${amount}
- From Account: ${fromAccount}
- To Account: ${toAccount}
If you did not authorize this transaction, please contact our support team immediately at support@backendledger.com.
`;

    const html = `
    <p>Hello ${name},</p>
    <p>We wanted to inform you about a recent transaction on your account.</p>
    <p><strong>Transaction Details:</strong></p>
    <ul>
        <li><strong>Amount:</strong> $${amount}</li>
        <li><strong>From Account:</strong> ${fromAccount}</li>
        <li><strong>To Account:</strong> ${toAccount}</li>
    </ul>
    <p>If you did not authorize this transaction, please contact our support team immediately at support@backendledger.com.</p>
    <p>Best regards,<br>The Backend Ledger Team</p>
  `;

    try {
        await sendEmail(userEmail, subject, text, html);
        console.log("Transaction email sent successfully!");
    } catch (error) {
        console.error("Error sending transaction email:", error);
    }
}

async function sendTransactionFailedEmail(userEmail, name, amount, fromAccount, toAccount) {

    const subject = "⚠️ Transaction Failed – Immediate Attention Required";
    const text = `Hello ${name},
We regret to inform you that a recent transaction on your account has failed.
Transaction Details:
- Amount: $${amount}
- From Account: ${fromAccount}
- To Account: ${toAccount}
Please review your account details and try the transaction again. If you need assistance, contact our support team at support@backendledger.com.
`;

    const html = `
    <p>Hello ${name},</p>
    <p>We regret to inform you that a recent transaction on your account has failed.</p>
    <p><strong>Transaction Details:</strong></p>
    <ul>
        <li><strong>Amount:</strong> $${amount}</li>
        <li><strong>From Account:</strong> ${fromAccount}</li>
        <li><strong>To Account:</strong> ${toAccount}</li>
    </ul>
    <p>Please review your account details and try the transaction again. If you need assistance, contact our support team at support@backendledger.com.</p>
    <p>Best regards,<br>The Backend Ledger Team</p>
  `;

    try {
        await sendEmail(userEmail, subject, text, html);
        console.log("Transaction failed email sent successfully!");
    } catch (error) {
        console.error("Error sending transaction failed email:", error);
    }
}

module.exports = { sendRegistrationEmail, sendTransactionEmail, sendTransactionFailedEmail };