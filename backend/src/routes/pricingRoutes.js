const express = require('express');
const {
  getPlans,
  startTrial,
  getBilling,
  previewUpgrade,
  confirmUpgrade,
  getTrialEligibility,
  cancelSubscription,
} = require('../controllers/pricingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getPlans);
router.post('/trial', protect, restrictTo('USER', 'ENTERPRISE_ADMIN'), startTrial);
router.get('/billing', protect, restrictTo('USER', 'ENTERPRISE_ADMIN'), getBilling);
router.patch('/subscription/cancel', protect, restrictTo('USER', 'ENTERPRISE_ADMIN'), cancelSubscription);
router.get('/trial/eligibility', protect, restrictTo('USER', 'ENTERPRISE_ADMIN'), getTrialEligibility);
router.post('/upgrade/preview', protect, restrictTo('USER', 'ENTERPRISE_ADMIN'), previewUpgrade);
router.post('/upgrade/confirm', protect, restrictTo('USER', 'ENTERPRISE_ADMIN'), confirmUpgrade);

module.exports = router;
