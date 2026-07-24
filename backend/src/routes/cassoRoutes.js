const express = require('express');
const { processCassoRecord } = require('../services/cassoSubscriptionService');

const router = express.Router();

// Casso posts { data: TransactionRecord[] }. A shared token is optional for
// local development; set CASSO_WEBHOOK_SECRET in production.
router.post('/webhook', async (req, res) => {
  const expectedToken = process.env.CASSO_WEBHOOK_SECRET;
  if (expectedToken && req.headers['secure-token'] !== expectedToken) {
    return res.status(401).json({ success: false, message: 'Invalid webhook token.' });
  }

  try {
    const records = Array.isArray(req.body?.data) ? req.body.data : [];
    for (const record of records) await processCassoRecord(record);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Casso] Webhook failed:', error.message);
    // A 200 prevents Casso retry storms; the polling job remains a fallback.
    return res.status(200).json({ success: false });
  }
});

module.exports = router;
