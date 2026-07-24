const Invoice = require('../models/Invoice');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const { generateInvoicePdf } = require('./invoicePdfService');

const CASSO_REFERENCE_PATTERN = /(ALSM[A-Z0-9]{8})/;

const activateInvoice = async (invoiceId) => {
  const invoice = await Invoice.findOneAndUpdate(
    { _id: invoiceId, status: 'open' },
    { $set: { status: 'paid', paid_at: new Date(), payment_provider: 'casso' } },
    { new: true }
  );
  if (!invoice) return false; // Already handled by a concurrent webhook/poll.

  const plan = await Plan.findById(invoice.pending_plan_id);
  if (!plan) {
    await Invoice.updateOne({ _id: invoice._id }, { $set: { status: 'uncollectible' } });
    return false;
  }

  const periodStart = new Date();
  const periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);
  await Subscription.findByIdAndUpdate(invoice.subscription_id, {
    $set: {
      plan_id: plan._id,
      plan_name: plan.name,
      status: 'active',
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: false,
      cancellation_reason: null,
      cancellation_requested_at: null,
      payment_provider: 'casso',
      'usage.screens_converted_this_month': 0,
      'usage.last_calculated_at': periodStart,
    },
  });

  try {
    await generateInvoicePdf(invoice);
    await Invoice.updateOne({ _id: invoice._id }, { $set: { pdf_url: `/api/invoices/${invoice._id}/pdf` } });
  } catch (error) {
    console.error(`Unable to generate PDF for paid Casso invoice ${invoice.invoice_number}:`, error.message);
  }
  return true;
};

const processCassoRecord = async (record) => {
  const description = String(record?.description || '').toUpperCase();
  const referenceMatch = description.match(CASSO_REFERENCE_PATTERN);
  if (!referenceMatch) return false;

  const reference = referenceMatch[1];
  const receivedAmount = Math.abs(Number(record.amount));
  const invoice = await Invoice.findOne({ payment_reference: reference, status: 'open' });
  if (!invoice || !Number.isFinite(receivedAmount) || receivedAmount < invoice.total) return false;

  const activated = await activateInvoice(invoice._id);
  if (activated) console.log(`[Casso] Subscription invoice ${invoice.invoice_number} paid.`);
  return activated;
};

const fetchAndProcessCassoTransactions = async () => {
  if (!process.env.CASSO_API_KEY) return;
  const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  try {
    const response = await fetch(`https://oauth.casso.vn/v2/transactions?fromDate=${fromDate}&sort=DESC&pageSize=50`, {
      headers: { Authorization: `Apikey ${process.env.CASSO_API_KEY}`, 'Content-Type': 'application/json' },
    });
    const body = await response.json();
    if (!response.ok || body.error !== 0) throw new Error(body.message || `Casso responded ${response.status}`);
    for (const record of body.data?.records || []) await processCassoRecord(record);
  } catch (error) {
    console.error('[Casso] Polling failed:', error.message);
  }
};

let pollingTimer = null;
const startCassoPolling = (intervalMs = 3 * 60 * 1000) => {
  if (pollingTimer || !process.env.CASSO_API_KEY) return;
  const poll = async () => {
    await fetchAndProcessCassoTransactions();
    pollingTimer = setTimeout(poll, intervalMs);
  };
  pollingTimer = setTimeout(poll, 5000);
};

module.exports = { processCassoRecord, fetchAndProcessCassoTransactions, startCassoPolling };
