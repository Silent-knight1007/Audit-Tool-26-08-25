import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';

const hashedSharedPassword = '$2b$10$hdmOGo5du0IJUxIo406MC.KJMX.2rvaoN72L8kz6pFkXDqu/CQwxa';


// Your hardcoded allowlist
const allowedEmails = [
  "pooja.punyani@onextel.com",
  "saurabh.gupta@onextel.com",
  "admin@onextel.com",
  "manager@onextel.com"
];

// Check email ends with @onextel.com
function isOnextelEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@onextel\.com$/.test(email);
}

router.post('/signin', (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Signin attempt:', { email, password });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!isOnextelEmail(email)) {
      return res.status(400).json({ message: 'Only @onextel.com emails are allowed.' });
    }

    if (!allowedEmails.includes(email)) {
      return res.status(401).json({ message: 'Access denied. Contact admin to request access.' });
    }

    // Compare provided password with the hashed shared password
    bcrypt.compare(password, hashedSharedPassword, (err, isMatch) => {
      if (err) {
        console.error('Password comparison error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid password.' });
      }

      // Success: email is allowed and password matched
      return res.status(200).json({ message: 'Sign-in successful.' });
    });

  } catch (err) {
    console.error('Sign-in error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


// new old post 
// router.post('/signin', (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required." });
//     }

//     if (!isOnextelEmail(email)) {
//       return res.status(400).json({ message: "Only @onextel.com emails are allowed." });
//     }

//     if (!allowedEmails.includes(email)) {
//       return res.status(401).json({ message: "Access denied. Contact admin to request access." });
//     }

//     // Next: Validate password (we'll do that in the next step)

//   } catch (err) {
//     console.error("Sign-in error:", err);
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// });

//old post
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

export default router;
