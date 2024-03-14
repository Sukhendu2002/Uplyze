const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmailAlert = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"Team Uplyze" <info@trial-x2p0347vdvk4zdrn.mlsender.net>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendEmailAlert };
