require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp@gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

module.exports = async (to, token) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: "Verify Your Email",
      text: `Click on this link to verify your email ${
        process.env.HOST
      }/verification/${token}`
    });
  } catch (err) {
    console.log(err);
  }
};
