const express = require('express');
const { getPlans, startTrial } = require('../controllers/pricingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getPlans);
router.post('/trial', protect, restrictTo('USER', 'ENTERPRISE_ADMIN'), startTrial);

module.exports = router;
