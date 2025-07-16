// utils/emails.js
import transporter from "./Mailer";

export const sendRegistrationEmail = async (toEmail, userName, userPassword) => {
  console.log("📧 Sending email to:", toEmail); // ✅ ADD this
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'Onextel Tool <noreply@onextel.com>',
      to: toEmail,
      subject: 'Welcome to Onextel Audit Program Tool',
      html: `
        <h2>Hello ${userName},</h2>
        <p>We're excited to have you on board!</p>
        <p><strong>Your login credentials:</strong></p>
        <ul>
          <li><b>Email:</b> ${toEmail}</li>
          <li><b>Password:</b> ${userPassword}</li>
        </ul>
        <p>Please do not share this email. You can now log into the system and get started.</p>
        <br />
        <em>Onextel Audit Team</em>
      `,
    });

    console.log(`📨 Welcome email sent to ${toEmail}`);
  } catch (error) {
    console.error(`❌ Email send failed to ${toEmail}:`, error.message);
  }
};
