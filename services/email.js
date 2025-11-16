const dotenv = require("dotenv");

dotenv.config();
const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_EMAIL_HOST,
    port: process.env.NEXT_PUBLIC_EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
    },
    tls: {
        rejectUnAuthorized: true
    }
});

const sendAccessEmail = async (ip, userAgent, referrer) => {
    const mailOptions = {
        from: `"Website Access Alert" <${process.env.NEXT_PUBLIC_EMAIL_USER}>`,
        to: process.env.NEXT_PUBLIC_TO_EMAIL,
        subject: "New User Accessed Your Website",
        html: `
      <h2>New Visitor Alert</h2>
      <p><strong>IP Address:</strong> ${ip}</p>
      <p><strong>User Agent:</strong> ${userAgent}</p>
      <p><strong>Referrer:</strong> ${referrer || "Direct Visit"}</p>
      <p>Timestamp: ${new Date().toLocaleString()}</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendAccessEmail };