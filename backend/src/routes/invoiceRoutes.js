const express = require('express');
const {
  getInvoices,
  getInvoice,
  downloadInvoicePdf,
} = require('../controllers/invoiceController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, restrictTo('USER', 'ENTERPRISE_ADMIN', 'ADMIN'));
router.get('/', getInvoices);
router.get('/:invoiceId', getInvoice);
router.get('/:invoiceId/pdf', downloadInvoicePdf);

module.exports = router;
