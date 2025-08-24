import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/auth.js'; // Adjust path as needed

const router = express.Router();

const hashedSharedPassword = '$2b$10$hdmOGo5du0IJUxIo406MC.KJMX.2rvaoN72L8kz6pFkXDqu/CQwxa';

const admin = [
  "demo@onextel.com"
];

const allowedEmails = [
  "demo1@onextel.com",
  "demo@onextel.com",
  "pooja.punyani@onextel.com",
  "saurabh.gupta@onextel.com",
  "admin@onextel.com",
  "manager@onextel.com"
];

const auditor = [
  "auditor1@onextel.com",
  "auditor2@onextel.com"
];

function isOnextelEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@onextel\.com$/.test(email);
}

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!isOnextelEmail(email)) {
      return res.status(400).json({ message: 'Only @onextel.com emails are allowed.' });
    }

    // Determine role on server side
    let role = null;
    if (admin.includes(email)) {
      role = "admin";
    } else if (auditor.includes(email)) {
      role = "auditor";
    } else if (allowedEmails.includes(email)) {
      role = "user";
    } else {
      return res.status(401).json({ message: 'Not authorized. Contact admin.' });
    }

    // Look for user in DB
    const user = await User.findOne({ email });

    if (user) {
      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password.' });
      }

      return res.status(200).json({ 
        message: 'Sign-in successful.', 
        role: role   // ✅ send correct role
      });

    } else {
      // If user not in DB, check shared password
      const isSharedPasswordMatch = await bcrypt.compare(password, hashedSharedPassword);
      if (!isSharedPasswordMatch) {
        return res.status(401).json({ message: 'Invalid password.' });
      }

      // Create new user in DB with detected role
      const newUser = new User({ email, password, role });
      await newUser.save();

      return res.status(200).json({ 
        message: 'Sign-in successful. Please reset your password.', 
        role: role   // ✅ send correct role
      });
    }

  } catch (err) {
    console.error('Sign-in error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
