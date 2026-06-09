const nodemailer = require('nodemailer');

/**
 * Send an email via Nodemailer.
 * @param {object} options
 * @param {string} options.to      - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html    - HTML body
 */
const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'ALSM'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

// ─── Email HTML templates ────────────────────────────────────────

const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px;
                border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; padding: 24px 32px; }
    .header h1 { color: #38bdf8; margin: 0; font-size: 22px; letter-spacing: 0.5px; }
    .header p  { color: #94a3b8; margin: 4px 0 0; font-size: 13px; }
    .body { padding: 32px; color: #334155; line-height: 1.7; }
    .body p { margin: 0 0 16px; }
    .btn { display: inline-block; background: #0284c7; color: #ffffff !important;
           padding: 13px 28px; border-radius: 6px; text-decoration: none;
           font-weight: 600; font-size: 15px; margin: 8px 0 24px; }
    .note { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 12px 16px;
            border-radius: 0 4px 4px 0; font-size: 13px; color: #475569; margin-top: 8px; }
    .footer { background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0;
              font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>ALSM</h1>
      <p>Automating Legacy System Modernization</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      © ${new Date().getFullYear()} ALSM. All rights reserved.<br/>
      If you did not perform this action, please ignore this email.
    </div>
  </div>
</body>
</html>`;

/**
 * Build a verification email HTML string.
 * @param {string} verifyURL - Full verification URL
 * @returns {string} HTML string
 */
const buildVerificationEmail = (verifyURL) =>
  baseTemplate(`
    <p>Thank you for registering with <strong>ALSM</strong>!</p>
    <p>Please verify your email address to activate your account:</p>
    <a href="${verifyURL}" class="btn">Verify Email Address</a>
    <div class="note">
      ⏱ This link expires in <strong>24 hours</strong>.<br/>
      If the button doesn't work, copy and paste this URL into your browser:<br/>
      <a href="${verifyURL}" style="word-break:break-all; color:#0284c7;">${verifyURL}</a>
    </div>
  `);

/**
 * Build a password reset email HTML string.
 * @param {string} resetURL - Full reset URL
 * @returns {string} HTML string
 */
const buildResetPasswordEmail = (resetURL) =>
  baseTemplate(`
    <p>We received a request to reset your <strong>ALSM</strong> account password.</p>
    <p>Click the button below to set a new password:</p>
    <a href="${resetURL}" class="btn">Reset Password</a>
    <div class="note">
      ⏱ This link expires in <strong>15 minutes</strong>.<br/>
      If you did not request a password reset, you can safely ignore this email.
    </div>
  `);

module.exports = { sendEmail, buildVerificationEmail, buildResetPasswordEmail };
