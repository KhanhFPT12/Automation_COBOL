const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Rate limiters ────────────────────────────────────────────────

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again in 15 minutes.',
  },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again in 1 hour.',
  },
});

const resendVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many resend attempts. Please try again in 1 hour.',
  },
});

// ─── Routes ──────────────────────────────────────────────────────

// Registration
router.post('/register/individual', authController.registerIndividual);
router.post('/register/enterprise', authController.registerEnterprise);

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification-email', resendVerificationLimiter, authController.resendVerificationEmail);

// Login
router.post('/login', loginLimiter, authController.login);

// Password reset
router.post('/forgot-password', forgotPasswordLimiter, authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected
router.get('/me', protect, authController.getMe);

module.exports = router;
