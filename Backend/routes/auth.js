// routes/auth.js (ES Module compatible - fixed version)
import express from 'express';
import bcrypt from 'bcryptjs';
import { sendRegistrationEmail } from '../utils/emails.js';
import User from '../models/auth.js'; // Must also be ESModule-compatible

const router = express.Router();

// ✅ Helper function to validate onextel.com domain
function isOnextelEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@onextel\.com$/.test(email);
}

// ✅ Register route (includes sending email with password)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Domain check
    if (!isOnextelEmail(email)) {
      return res.status(400).json({ message: 'Only @onextel.com emails are allowed.' });
    }

    // 2️⃣ Password strength check
    const strongPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPwd.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      });
    }

    // 3️⃣ Check duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: 'You are already registered. Please sign in instead.'
      });
    }

    // 4️⃣ Hash and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // 5️⃣ Send custom welcome email with credentials
    await sendRegistrationEmail(email, name, password);

    return res.status(201).json({
      message: `Welcome ${name}, you are successfully registered for the Onextel Audit Program Tool. Your credentials have been sent to your email address.`
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Registration failed. Try again later.' });
  }
});

// ✅ Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isOnextelEmail(email)) {
      return res.status(400).json({ message: 'Only @onextel.com emails are allowed.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not registered. Please register first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed.' });
  }
});

// ❌ Removed forgot/reset password logic per your instruction

export default router;
