import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import authMiddleware from './authMiddleware.js';

const router = express.Router();

const allowedEmails = [
  "pooja.punyani@onextel.com",
  "user1@onextel.com",
  "admin@onextel.com",
  "manager@onextel.com"];

function isOnextelEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@onextel\.com$/.test(email);
}
 
// Temporary in-memory token store (replace with DB for production)
const loginTokens = new Map();

// Nodemailer setup - replace with your config or environment vars
  const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // smtp.office365.com
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,                     // false since port 587 uses STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,       // for testing, remove in production if possible
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    if (!isOnextelEmail(email)) {
      return res.status(400).json({ message: "Only @onextel.com emails are allowed." });
    }

    if (!allowedEmails.includes(email.toLowerCase())) {
      return res.status(401).json({ message: "Access denied. Contact admin to request access." });
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

    // Store token in memory with expiry and email (for demo purposes)
    loginTokens.set(token, { email, expiresAt });

    // Construct the magic login link (update URL to your frontend)
    const magicLink = `${process.env.FRONTEND_URL}/login?token=${token}&email=${encodeURIComponent(email)}`;

    // await transporter.sendMail({
      //   from: process.env.EMAIL_USER,
      //   to: email,
      //   subject: 'Your One-Time Sign-in Link',
      //   html: `<p>Click the link below to sign in:</p><a href="${magicLink}">${magicLink}</a><p>This link expires in 15 minutes.</p>`
      // });
    // Send magic link email
    await transporter.sendMail({
    from: process.env.FROM_EMAIL,   // e.g. "Onextel Tool <pooja.punyani@onextel.com>"
    to: email,
    subject: 'Your One-Time Sign-in Link',
    html: `<p>Click the link below to sign in:</p><a href="${magicLink}">${magicLink}</a><p>This link expires in 15 minutes.</p>`
    });

    return res.status(200).json({ message: "Magic login link sent to your email." });
  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Token verification route (e.g., called from frontend URL /login?token=xxx&email=yyy)
router.post('/verify-token', (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({ message: 'Token and email are required' });
    }

    // Retrieve the stored token data
    const tokenData = loginTokens.get(token);

    if (!tokenData) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Check token expiry
    if (Date.now() > tokenData.expiresAt) {
      loginTokens.delete(token);
      return res.status(401).json({ message: 'Token has expired' });
    }

    // Check email matches
    if (email.toLowerCase() !== tokenData.email.toLowerCase()) {
      return res.status(401).json({ message: 'Token does not match email' });
    }

    // Token valid - remove it from storage (one-time use)
    loginTokens.delete(token);

    // At this point, user is authenticated.
    // TODO: Create a session or generate JWT here.

    // Example: create JWT (using jsonwebtoken package)
    // const jwt = require('jsonwebtoken');
    // const tokenJWT = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // return res.json({ message: 'Login successful', token: tokenJWT });

    // inside /verify-token route, after confirming valid token and email:

   // Create JWT token with user email payload and expiry (e.g., 1 hour)
   const jwtToken = jwt.sign(
      { email: tokenData.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ message: 'Login successful', token: jwtToken });

  } catch (err) {
    console.error('Verify token error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

router.get('/protected-data', authMiddleware, (req, res) => {
  // Accessible only if user is logged in
  res.json({ message: 'Secret data!', user: req.user });
});
console.log('SMTP_HOST is:', process.env.SMTP_HOST);
export default router;


































// import express from 'express';

// const router = express.Router();

// // Your hardcoded allowlist
// const allowedEmails = [
//   "pooja.punyani@onextel.com",
//   "user1@onextel.com",
//   "admin@onextel.com",
//   "manager@onextel.com"
// ];

// // Check email ends with @onextel.com
// function isOnextelEmail(email) {
//   return /^[a-zA-Z0-9._%+-]+@onextel\.com$/.test(email);
// }

// router.post('/signin', (req, res) => {
//   try {
//     const { email } = req.body;

//     // ✅ Defensive check
//     if (!email) {
//       return res.status(400).json({ message: "Email is required." });
//     }

//     // ✅ Optional domain restriction
//     if (!isOnextelEmail(email)) {
//       return res.status(400).json({ message: "Only @onextel.com emails are allowed." });
//     }

//     // ✅ Whitelist check
//     if (!allowedEmails.includes(email)) {
//       return res.status(401).json({ message: "Access denied. Contact admin to request access." });
//     }

//     // ✅ SUCCESS
//     return res.status(200).json({ message: "Sign-in successful." });

//   } catch (err) {
//     console.error("Sign-in error:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// });

// export default router;
