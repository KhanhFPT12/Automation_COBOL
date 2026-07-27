const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const adminUserController = require('../controllers/adminUserController');
const adminMeetingController = require('../controllers/adminMeetingController');
const adminDashboardController = require('../controllers/adminDashboardController');
const googleAuthController = require('../controllers/googleAuthController');
const adminPaymentSettingsController = require('../controllers/adminPaymentSettingsController');

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

// ─── [TEMP] Reset incorrectly-assigned logs back to null ────────
// DELETE THIS ROUTE after running it once on production
router.post('/conversions/reset-anonymous', async (req, res) => {
  try {
    const User = require('../models/User');
    const ConversionLog = require('../models/ConversionLog');
    const adminUser = await User.findOne({ role: 'ADMIN' });
    if (!adminUser) {
      return res.json({ success: false, message: 'No admin user found' });
    }
    // Reset all logs that were assigned to admin but should be anonymous
    // (those created before the token fix date)
    const cutoffDate = new Date('2026-07-28T00:00:00.000Z');
    const result = await ConversionLog.updateMany(
      { user: adminUser._id, createdAt: { $lt: cutoffDate } },
      { $set: { user: null } }
    );
    return res.json({
      success: true,
      message: `Reset ${result.modifiedCount} logs back to anonymous`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── User management ───────────────────────────────────────────
router.get('/users', adminUserController.listUsers);
router.get('/users/:id', adminUserController.getUserDetail);
router.patch('/users/:id', adminUserController.updateUser);
router.patch('/users/:id/lock', adminUserController.lockUser);
router.patch('/users/:id/unlock', adminUserController.unlockUser);
router.patch('/users/:id/subscription/reactivate', adminUserController.reactivateSubscription);
router.delete('/users/:id', adminUserController.deleteUser);

// ─── Meeting management ────────────────────────────────────────
router.get('/meetings', adminMeetingController.listMeetings);
router.get('/meetings/pending-count', adminMeetingController.getPendingCount);
router.get('/meetings/:id', adminMeetingController.getMeeting);
router.patch('/meetings/:id/approve', adminMeetingController.approveMeeting);
router.patch('/meetings/:id/reject', adminMeetingController.rejectMeeting);
router.patch('/meetings/:id/cancel', adminMeetingController.cancelMeeting);
router.patch('/meetings/:id/complete', adminMeetingController.completeMeeting);

// ─── Google Calendar integration (Settings page) ───────────────
router.get('/google/connect', googleAuthController.connect);
router.get('/google/status', googleAuthController.status);
router.delete('/google', googleAuthController.disconnect);

// ─── Bank account settings (Settings page) ─────────────────────
router.get('/settings/bank-account', adminPaymentSettingsController.getBankAccounts);
router.post('/settings/bank-account', adminPaymentSettingsController.createBankAccount);
router.put('/settings/bank-account/:id', adminPaymentSettingsController.updateBankAccount);
router.delete('/settings/bank-account/:id', adminPaymentSettingsController.deleteBankAccount);
router.patch('/settings/bank-account/:id/default', adminPaymentSettingsController.setDefaultBankAccount);
router.get('/settings/bank-account/audit-logs', adminPaymentSettingsController.getAuditLogs);

// ─── Plan settings (Settings page) ─────────────────────────────
router.get('/settings/plans', adminPaymentSettingsController.getPlans);
router.put('/settings/plans/:id', adminPaymentSettingsController.updatePlan);

// ─── Invoice settings (Invoices & Billing) ──────────────────────
router.get('/settings/invoices', adminPaymentSettingsController.getInvoices);
router.post('/settings/invoices/:id/confirm', adminPaymentSettingsController.confirmInvoicePayment);

module.exports = router;
