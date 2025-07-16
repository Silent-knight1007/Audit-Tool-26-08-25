// utils/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

});
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Email server error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

export default transporter;
