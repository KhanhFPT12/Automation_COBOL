const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit_price: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    period_start: { type: Date, required: true },
    period_end: { type: Date, required: true },
  },
  { _id: false }
);

const InvoiceStatus = {
  DRAFT: 0,
  OPEN: 1,
  PAID: 2,
  VOID: 3,
  UNCOLLECTIBLE: 4
};

const InvoiceStatusNames = {
  0: 'draft',
  1: 'open',
  2: 'paid',
  3: 'void',
  4: 'uncollectible'
};

const invoiceSchema = new mongoose.Schema(
  {
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    organization_uuid: { type: String, required: true, trim: true },
    subscription_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    invoice_number: { type: String, required: true, unique: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true },
    tax_rate: { type: Number, required: true, min: 0 },
    tax_amount: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: Number,
      required: true,
      default: InvoiceStatus.DRAFT,
    },
    line_items: { type: [lineItemSchema], required: true, default: [] },
    invoice_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    paid_at: { type: Date, default: null },
    pdf_url: { type: String, default: null, trim: true },
    payment_reference: { type: String, unique: true, sparse: true, trim: true },
    pending_plan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

invoiceSchema.index({ organization_id: 1, invoice_date: -1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
module.exports.InvoiceStatus = InvoiceStatus;
module.exports.InvoiceStatusNames = InvoiceStatusNames;
