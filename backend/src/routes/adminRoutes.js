const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const adminUserController = require('../controllers/adminUserController');
const adminMeetingController = require('../controllers/adminMeetingController');
const adminDashboardController = require('../controllers/adminDashboardController');
const googleAuthController = require('../controllers/googleAuthController');

const router = express.Router();

// The OAuth callback is reached by Google's own redirect (no Bearer header
// possible) and re-authenticates the admin itself via the `state` JWT - it
// must be mounted before the blanket protect/restrictTo below.
router.get('/google/callback', googleAuthController.callback);

router.use(protect, restrictTo('ADMIN'));

// ─── Dashboard ─────────────────────────────────────────────────
router.get('/dashboard/stats', adminDashboardController.getStats);
router.get('/dashboard/activity', adminDashboardController.getRecentActivity);

// ─── Conversion history ────────────────────────────────────────
router.get('/conversions', adminDashboardController.listConversions);

// ─── User management ───────────────────────────────────────────
router.get('/users', adminUserController.listUsers);
router.get('/users/:id', adminUserController.getUserDetail);
router.patch('/users/:id', adminUserController.updateUser);
router.patch('/users/:id/lock', adminUserController.lockUser);
router.patch('/users/:id/unlock', adminUserController.unlockUser);
router.delete('/users/:id', adminUserController.deleteUser);

// ─── Meeting management ────────────────────────────────────────
router.get('/meetings', adminMeetingController.listMeetings);
router.get('/meetings/:id', adminMeetingController.getMeeting);
router.patch('/meetings/:id/approve', adminMeetingController.approveMeeting);
router.patch('/meetings/:id/reject', adminMeetingController.rejectMeeting);
router.patch('/meetings/:id/cancel', adminMeetingController.cancelMeeting);
router.patch('/meetings/:id/complete', adminMeetingController.completeMeeting);

// ─── Google Calendar integration (Settings page) ───────────────
router.get('/google/connect', googleAuthController.connect);
router.get('/google/status', googleAuthController.status);
router.delete('/google', googleAuthController.disconnect);

module.exports = router;
