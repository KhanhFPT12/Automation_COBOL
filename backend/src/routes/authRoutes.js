const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Try again in 1 hour.' },
});

const resendVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Try again in 1 hour.' },
});

// Registration
router.post('/register/individual', authController.registerIndividual);
router.post('/register/enterprise', authController.registerEnterprise);

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification-email', resendVerificationLimiter, authController.resendVerificationEmail);

// Login
router.post('/login', loginLimiter, authController.login);

// OAuth - Google
router.post('/google', authController.googleLogin);

// OAuth - GitHub
router.get('/github', authController.githubLogin);
router.get('/github/callback', authController.githubCallback);

// Password reset
router.post('/forgot-password', forgotPasswordLimiter, authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected
router.get('/me', protect, authController.getMe);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;
