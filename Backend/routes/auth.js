import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/auth.js'; // Adjust path as needed

const router = express.Router();

const hashedSharedPassword = '$2b$10$hdmOGo5du0IJUxIo406MC.KJMX.2rvaoN72L8kz6pFkXDqu/CQwxa';

const allowedEmails = [
  "pooja.punyani@onextel.com",
  "saurabh.gupta@onextel.com",
  "admin@onextel.com",
  "manager@onextel.com"
];

function isOnextelEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@onextel\.com$/.test(email);
}

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Signin attempt for email: ${email}`);
    console.log(`Password entered: ${password}`);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!isOnextelEmail(email)) {
      return res.status(400).json({ message: 'Only @onextel.com emails are allowed.' });
    }

    if (!allowedEmails.includes(email)) {
      return res.status(401).json({ message: 'Access denied. Contact admin to request access.' });
    }

    // Look for user in DB
    const user = await User.findOne({ email });

    if (user) {
      // User exists, validate password
      console.log('User found in DB. Verifying password...');
      const isMatch = await user.comparePassword(password);
      console.log('User password match result:', isMatch);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password.' });
      }

      // Successful login
      return res.status(200).json({ message: 'Sign-in successful.' });

    } else {
      // User does not exist, check shared password
      console.log('User not found in DB. Checking shared password...');
      const isSharedPasswordMatch = await bcrypt.compare(password, hashedSharedPassword);
      console.log('Shared password match result:', isSharedPasswordMatch);
      if (!isSharedPasswordMatch) {
        return res.status(401).json({ message: 'Invalid password.' });
      }
      console.log('Shared password matched. Creating user record in DB.');
      // Login successful with shared password, create user in DB without custom password yet
      const newUser = new User({ email, password }); // password will be hashed by schema middleware
      await newUser.save();

      return res.status(200).json({ message: 'Sign-in successful. Please reset your password.' });
    }

  } catch (err) {
    console.error('Sign-in error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!allowedEmails.includes(email)) {
      return res.status(401).json({ message: 'Access denied.' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New password and confirm password do not match.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if old password matches either user's password or shared password
    const isOldPasswordMatch = await user.comparePassword(oldPassword);
    const isOldPasswordShared = await bcrypt.compare(oldPassword, hashedSharedPassword);

    if (!isOldPasswordMatch && !isOldPasswordShared) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    // Update password
    user.password = newPassword; // Will be hashed by schema middleware on save
    await user.save();

    return res.status(200).json({ message: 'Password reset successful. Please log in with your new password.' });

  } catch (err) {
    console.error('Password reset error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


export default router;
