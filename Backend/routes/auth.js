import express from 'express';

const router = express.Router();

// Your hardcoded allowlist
const allowedEmails = [
  "pooja.punyani@onextel.com",
  "user1@onextel.com",
  "admin@onextel.com",
  "manager@onextel.com"
];

// Check email ends with @onextel.com
function isOnextelEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@onextel\.com$/.test(email);
}

router.post('/signin', (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Defensive check
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // ✅ Optional domain restriction
    if (!isOnextelEmail(email)) {
      return res.status(400).json({ message: "Only @onextel.com emails are allowed." });
    }

    // ✅ Whitelist check
    if (!allowedEmails.includes(email)) {
      return res.status(401).json({ message: "Access denied. Contact admin to request access." });
    }

    // ✅ SUCCESS
    return res.status(200).json({ message: "Sign-in successful." });

  } catch (err) {
    console.error("Sign-in error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

export default router;
