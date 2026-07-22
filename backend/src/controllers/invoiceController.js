const fs = require('fs/promises');
const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');
const { generateInvoicePdf, getInvoicePdfPath } = require('../services/invoicePdfService');

const ensureInvoicePdf = async (invoice) => {
  if (invoice.pdf_url) return;

  try {
    await generateInvoicePdf(invoice);
    invoice.pdf_url = `/api/invoices/${invoice._id}/pdf`;
    await invoice.save();
  } catch (error) {
    console.error(`Unable to generate PDF for invoice ${invoice.invoice_number}:`, error);
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
  status: invoice.status,
  invoiceDate: invoice.invoice_date,
  dueDate: invoice.due_date,
  paidAt: invoice.paid_at,
  pdfStatus: invoice.pdf_url ? 'ready' : 'processing',
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

    await ensureInvoicePdf(invoice);

    return res.status(200).json({
      success: true,
      data: serializeInvoice(invoice, true),
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
