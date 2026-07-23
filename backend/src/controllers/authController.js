const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendEmail, buildVerificationEmail, buildResetPasswordEmail } = require('../utils/sendEmail');
const { ensureStarterSubscription } = require('../services/subscriptionService');

// ─── Helpers ─────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Hash a raw token with SHA-256 (for DB storage) */
const hashToken = (raw) =>
  crypto.createHash('sha256').update(raw).digest('hex');

/**
 * Create a hashed email-verification token, persist it on the user document,
 * and send the verification email.
 */
const issueAndSendVerificationEmail = async (user) => {
  const rawToken = crypto.randomBytes(32).toString('hex');

  user.emailVerificationToken = hashToken(rawToken);
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 h
  await user.save({ validateBeforeSave: false });

  const verifyURL = `${process.env.API_URL}/api/auth/verify-email/${rawToken}`;
  const recipientEmail = user.email || user.businessEmail;

  await sendEmail({
    to: recipientEmail,
    subject: 'ALSM – Verify Your Email Address',
    html: buildVerificationEmail(verifyURL),
  });
};

// ─── Controllers ─────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// @desc    Register individual account
// @route   POST /api/auth/register/individual
// @access  Public
// ────────────────────────────────────────────────────────────────
exports.registerIndividual = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // ── Field presence
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: fullName, email, password, phone.',
      });
    }

    // ── Email format
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // ── Password length
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    // ── Duplicate check
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'This email is already registered.' });
    }

    // ── Create user (role is enforced by the pre-save hook in the model)
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      password,          // hashed by pre-save hook
      phone: phone.trim(),
      accountType: 'INDIVIDUAL',
      role: 'USER',      // also enforced by model hook
    });

    await ensureStarterSubscription(user._id);

    // ── Send verification email
    let emailSent = true;
    try {
      await issueAndSendVerificationEmail(user);
    } catch (emailErr) {
      emailSent = false;
      console.error('Verification email failed:', emailErr.message);
    }

    return res.status(201).json({
      success: true,
      emailSent,
      message: emailSent
        ? 'Registration successful! Please check your email to verify your account.'
        : 'Registration successful! However, the verification email could not be sent. Please use "Resend Verification" on the login page.',
    });
  } catch (err) {
    console.error('registerIndividual error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Register enterprise account
// @route   POST /api/auth/register/enterprise
// @access  Public
// ────────────────────────────────────────────────────────────────
exports.registerEnterprise = async (req, res) => {
  try {
    const {
      companyName,
      businessEmail,
      password,
      phone,
      representativeName,
      representativePosition,
      companySize,
      industry,
      legacySystemType,
      targetTechStack,
    } = req.body;

    // ── Required field presence
    const requiredFields = { companyName, businessEmail, password, phone, representativeName, representativePosition };
    const missing = Object.entries(requiredFields)
      .filter(([, v]) => !v)
      .map(([k]) => k);

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}.`,
      });
    }

    // ── Email format
    if (!EMAIL_REGEX.test(businessEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid business email address.' });
    }

    // ── Password length
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    // ── Duplicate check
    const existing = await User.findOne({ businessEmail: businessEmail.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'This business email is already registered.' });
    }

    // ── Normalise array fields (accept string or array)
    const toArray = (val) => {
      if (!val) return [];
      return Array.isArray(val) ? val.map((v) => v.trim()) : [val.trim()];
    };

    // ── Create user (role enforced by model hook)
    const user = await User.create({
      companyName: companyName.trim(),
      businessEmail: businessEmail.toLowerCase(),
      password,
      phone: phone.trim(),
      representativeName: representativeName.trim(),
      representativePosition: representativePosition.trim(),
      companySize: companySize || null,
      industry: industry ? industry.trim() : undefined,
      legacySystemType: toArray(legacySystemType),
      targetTechStack: toArray(targetTechStack),
      accountType: 'ENTERPRISE',
      role: 'ENTERPRISE_ADMIN',
    });

    await ensureStarterSubscription(user._id);

    // ── Send verification email
    let emailSent = true;
    try {
      await issueAndSendVerificationEmail(user);
    } catch (emailErr) {
      emailSent = false;
      console.error('Verification email failed:', emailErr.message);
    }

    return res.status(201).json({
      success: true,
      emailSent,
      message: emailSent
        ? 'Enterprise registration successful! Please check your business email to verify your account.'
        : 'Enterprise registration successful! However, the verification email could not be sent. Please use "Resend Verification" on the login page.',
    });
  } catch (err) {
    console.error('registerEnterprise error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Verify email via token in link
// @route   GET /api/auth/verify-email/:token
// @access  Public
// ────────────────────────────────────────────────────────────────
exports.verifyEmail = async (req, res) => {
  try {
    const hashed = hashToken(req.params.token);

    // Must select hidden fields explicitly
    const user = await User.findOne({
      emailVerificationToken: hashed,
      emailVerificationExpires: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Verification link is invalid or has expired. Please request a new one.',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
    });
  } catch (err) {
    console.error('verifyEmail error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Resend email verification
// @route   POST /api/auth/resend-verification-email
// @access  Public
// ────────────────────────────────────────────────────────────────
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address.' });
    }

    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { businessEmail: email.toLowerCase() }],
    });

    // Generic message to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email is registered and unverified, a verification email has been sent.',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'This email is already verified. You can log in.',
      });
    }

    await issueAndSendVerificationEmail(user);

    return res.status(200).json({
      success: true,
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (err) {
    console.error('resendVerificationEmail error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Login (individual or enterprise)
// @route   POST /api/auth/login
// @access  Public
// ────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Search both email fields
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { businessEmail: email.toLowerCase() }],
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
        hint: 'Use POST /api/auth/resend-verification-email to receive a new link.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been locked. Please contact an administrator.',
      });
    }

    // Promote to ADMIN if this email was added to ADMIN_EMAILS after the
    // account already existed (the pre-save hook only runs on save()).
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const candidateEmail = (user.email || user.businessEmail || '').toLowerCase();
    if (user.role !== 'ADMIN' && adminEmails.includes(candidateEmail)) {
      user.role = 'ADMIN';
      await user.save({ validateBeforeSave: false });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user,   // toJSON() strips sensitive fields automatically
    });
  } catch (err) {
    console.error('login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
// ────────────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address.' });
    }

    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { businessEmail: email.toLowerCase() }],
    });

    // Generic message to prevent email enumeration
    const GENERIC_MSG = 'If that email is registered, a password reset link has been sent.';

    if (!user) {
      return res.status(200).json({ success: true, message: GENERIC_MSG });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = hashToken(rawToken);
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    try {
      await sendEmail({
        to: user.email || user.businessEmail,
        subject: 'ALSM – Password Reset Request',
        html: buildResetPasswordEmail(resetURL),
      });
    } catch (emailErr) {
      // Rollback tokens on email failure
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error('Reset email failed:', emailErr.message);
      return res.status(500).json({ success: false, message: 'Failed to send reset email. Please try again.' });
    }

    return res.status(200).json({ success: true, message: GENERIC_MSG });
  } catch (err) {
    console.error('forgotPassword error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Reset password using token from email
// @route   POST /api/auth/reset-password/:token
// @access  Public
// ────────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a new password.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const hashed = hashToken(req.params.token);

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset link is invalid or has expired. Please request a new one.',
      });
    }

    // Set new password (hashed by pre-save hook), clear reset tokens
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (err) {
    console.error('resetPassword error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private (requires Bearer token)
// ────────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('getMe error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Google OAuth Login (Sign In With Google)
// @route   POST /api/auth/google
// @access  Public
// ────────────────────────────────────────────────────────────────
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, message: 'Google credential is required.' });
    if (!process.env.GOOGLE_CLIENT_ID) return res.status(500).json({ success: false, message: 'Google login is not configured.' });

    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const fullName = payload.name || email;
    if (!email) return res.status(400).json({ success: false, message: 'Google account does not provide an email.' });

    let user = await User.findOne({ $or: [{ googleId }, { email }, { businessEmail: email }] });
    if (!user) {
      user = await User.create({ googleId, fullName, email, accountType: 'INDIVIDUAL', role: 'USER', isEmailVerified: true });
    } else {
      if (!user.googleId) user.googleId = googleId;
      user.isEmailVerified = true;
      await user.save({ validateBeforeSave: false });
    }

    const token = generateToken(user._id);
    return res.status(200).json({ success: true, token, user });
  } catch (err) {
    console.error('googleLogin error:', err.message);
    return res.status(401).json({ success: false, message: 'Google login failed.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    GitHub OAuth Redirect
// @route   GET /api/auth/github
// @access  Public
// ────────────────────────────────────────────────────────────────
exports.githubLogin = (req, res) => {
  const params = new URLSearchParams({ client_id: process.env.GITHUB_CLIENT_ID, redirect_uri: process.env.GITHUB_CALLBACK_URL, scope: 'read:user user:email' });
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};

// ────────────────────────────────────────────────────────────────
// @desc    GitHub OAuth Callback
// @route   GET /api/auth/github/callback
// @access  Public
// ────────────────────────────────────────────────────────────────
exports.githubCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.redirect(`${process.env.CLIENT_URL}/?auth_error=github_missing_code`);

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code, redirect_uri: process.env.GITHUB_CALLBACK_URL }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.redirect(`${process.env.CLIENT_URL}/?auth_error=github_token_failed`);

    const userRes = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: 'application/vnd.github+json' } });
    const githubUser = await userRes.json();

    const emailsRes = await fetch('https://api.github.com/user/emails', { headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: 'application/vnd.github+json' } });
    const emails = await emailsRes.json();
    const primaryEmailObj = Array.isArray(emails) ? emails.find(e => e.primary && e.verified) || emails.find(e => e.verified) : null;
    const email = primaryEmailObj?.email?.toLowerCase();
    if (!email) return res.redirect(`${process.env.CLIENT_URL}/?auth_error=github_email_missing`);

    const githubId = String(githubUser.id);
    const fullName = githubUser.name || githubUser.login || email;
    const avatarUrl = githubUser.avatar_url;

    let user = await User.findOne({ $or: [{ githubId }, { email }, { businessEmail: email }] });
    if (!user) {
      user = await User.create({ githubId, fullName, email, avatarUrl, accountType: 'INDIVIDUAL', role: 'USER', isEmailVerified: true });
    } else {
      if (!user.githubId) user.githubId = githubId;
      if (!user.avatarUrl && avatarUrl) user.avatarUrl = avatarUrl;
      user.isEmailVerified = true;
      await user.save({ validateBeforeSave: false });
    }

    const token = generateToken(user._id);
    return res.redirect(`${process.env.CLIENT_URL}/auth/github/success?token=${token}`);
  } catch (err) {
    console.error('githubCallback error:', err.message);
    return res.redirect(`${process.env.CLIENT_URL}/?auth_error=github_failed`);
  }
};
