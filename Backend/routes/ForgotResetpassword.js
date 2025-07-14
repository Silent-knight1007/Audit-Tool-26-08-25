
// Add to your auth routes
const crypto = require('crypto');
const User = require('../models/User');

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If this email is registered, a reset link has been sent.' });

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send email (replace with real email sending)
  console.log(`Reset link: http://localhost:5000/reset-password/${token}`);

  res.status(200).json({ message: 'If this email is registered, a reset link has been sent.' });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });

  // Hash new password
  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.status(200).json({ message: 'Password has been reset. Please log in.' });
});
