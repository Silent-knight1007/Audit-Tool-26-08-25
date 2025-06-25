const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({ message: 'Login successful' });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const user = new User({ username, password });
  await user.save();

  res.status(200).json({ message: 'User registered' });
});

module.exports = router;
