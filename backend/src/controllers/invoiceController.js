const fs = require('fs/promises');
const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const BankAccountSettings = require('../models/BankAccountSettings');
const { generateInvoicePdf, getInvoicePdfPath } = require('../services/invoicePdfService');

const ensureInvoicePdf = async (invoice) => {
  if (invoice.pdf_url) return;

  try {
    const User = require('../models/User');
    const user = await User.findById(invoice.organization_id)
      .select('fullName companyName email businessEmail representativeName')
      .lean();
    const customerName = user
      ? (user.companyName || user.fullName || user.representativeName || user.email || user.businessEmail || 'Valued Customer')
      : 'Valued Customer';

    await generateInvoicePdf(invoice, customerName);
    invoice.pdf_url = `/api/invoices/${invoice._id}/pdf`;
    await invoice.save();
  } catch (error) {
    console.error(`Unable to generate PDF for invoice ${invoice.invoice_number}:`, error.message || error);
    console.error(error.stack);
  }
};

const serializeInvoice = (invoice, includeLineItems = false) => ({
  id: invoice._id,
  invoiceNumber: invoice.invoice_number,
  amount: invoice.amount,
  currency: invoice.currency,
  taxRate: invoice.tax_rate,
  taxAmount: invoice.tax_amount,
  total: invoice.total,
  status: Invoice.InvoiceStatusNames[invoice.status] || 'draft',
  invoiceDate: invoice.invoice_date,
  dueDate: invoice.due_date,
  paidAt: invoice.paid_at,
  pdfStatus: invoice.pdf_url ? 'ready' : 'processing',
  paymentReference: invoice.payment_reference,
  ...(includeLineItems
    ? {
        subscriptionId: invoice.subscription_id,
        lineItems: invoice.line_items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          amount: item.amount,
          periodStart: item.period_start,
          periodEnd: item.period_end,
        })),
      }
    : {}),
});

exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ organization_id: req.user._id })
      .sort({ invoice_date: -1, created_at: -1 });

    await Promise.all(invoices.map(ensureInvoicePdf));

    return res.status(200).json({
      success: true,
      data: invoices.map((invoice) => serializeInvoice(invoice)),
    });
  } catch (error) {
    return next(error);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.invoiceId)) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    const invoice = await Invoice.findOne({
      _id: req.params.invoiceId,
      organization_id: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    // Auto-void if open and past 15 minutes
    if (invoice.status === Invoice.InvoiceStatus.OPEN) {
      // Trigger throttled Casso fetch on-demand
      const { fetchAndProcessCassoTransactionsThrottled } = require('../services/cassoSubscriptionService');
      fetchAndProcessCassoTransactionsThrottled().catch(err => {
        console.error('[Casso] On-demand throttled fetch failed:', err.message);
      });

      const expirationLimitMs = 15 * 60 * 1000;
      if (Date.now() - new Date(invoice.created_at).getTime() > expirationLimitMs) {
        invoice.status = Invoice.InvoiceStatus.VOID;
        await invoice.save();
      }
    }

    await ensureInvoicePdf(invoice);

    const data = serializeInvoice(invoice, true);

    // If the invoice is still open, attach the payment QR code and bank details
    if (invoice.status === Invoice.InvoiceStatus.OPEN) {
      const bankSettings = await BankAccountSettings.findOne({ is_default: true }).lean()
        || await BankAccountSettings.findOne().lean();
      if (bankSettings) {
        const { generateVietQR } = require('../utils/emvco');
        const qrData = generateVietQR({
          bin: bankSettings.bin,
          accountNumber: bankSettings.account_number,
          accountName: bankSettings.account_name,
          amount: invoice.total,
          orderCode: invoice.payment_reference,
        });
        data.vietQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
        data.bankDetails = {
          bin: bankSettings.bin,
          accountNumber: bankSettings.account_number,
          accountName: bankSettings.account_name,
        };
      }
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

exports.downloadInvoicePdf = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.invoiceId)) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    const invoice = await Invoice.findOne({
      _id: req.params.invoiceId,
      organization_id: req.user._id,
    })
      .select('invoice_number pdf_url')
      .lean();

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }
    if (!invoice.pdf_url) {
      return res.status(409).json({
        success: false,
        message: 'Invoice PDF is still being processed.',
      });
    }

    // Cloudinary URL → redirect; local path → download
    if (invoice.pdf_url.startsWith('http')) {
      return res.redirect(invoice.pdf_url);
    }

    const filePath = getInvoicePdfPath(invoice._id);
    try {
      await fs.access(filePath);
    } catch {
      return res.status(409).json({
        success: false,
        message: 'Invoice PDF is still being processed.',
      });
    }

    return res.download(filePath, `${invoice.invoice_number}.pdf`, (error) => {
      if (error && !res.headersSent) next(error);
    });
  } catch (error) {
    return next(error);
  }
};
