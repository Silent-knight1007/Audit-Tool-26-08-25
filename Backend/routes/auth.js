const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Helper: Validate @onextel.com email
function isOnextelEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@onextel\.com$/.test(email);
}

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Email domain check
  if (!isOnextelEmail(email)) {
    return res.status(400).json({ message: 'Only @onextel.com emails are allowed.' });
  }

  // Password strength check
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' });
  }

  // Duplicate check
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'You are already registered. Please sign in or use "forgot password".' });
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hash });
  await user.save();

  res.status(200).json({
    message: `Hello ${email}, you are successfully registered at Onextel Audit Program Tool. Now you can move forward for sign in process to explore the tool.`
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!isOnextelEmail(email)) {
    return res.status(400).json({ message: 'Only @onextel.com emails are allowed.' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  res.status(200).json({ message: 'Login successful' });
});

// === Add this: Forgot Password route ===
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists
    return res.status(200).json({ message: 'If this email is registered, a reset link has been sent.' });
  }

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Set up nodemailer transporter (replace with your SMTP details)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_gmail_app_password',
    },
  });

  const resetUrl = `http://localhost:5000/reset-password/${token}`;

  await transporter.sendMail({
    to: user.email,
    subject: 'Password Reset - Onextel Audit Program Tool',
    html: `
      <p>You requested a password reset.</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>
    `,
  });

  res.status(200).json({ message: 'If this email is registered, a reset link has been sent.' });
});

// === Add this: Reset Password route ===
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'Password has been reset. Please log in.' });
});

module.exports = router;
