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
      type: String,
      enum: ['draft', 'open', 'paid', 'void', 'uncollectible'],
      required: true,
    },
    line_items: { type: [lineItemSchema], required: true, default: [] },
    invoice_date: { type: Date, required: true },
    due_date: { type: Date, required: true },
    paid_at: { type: Date, default: null },
    pdf_url: { type: String, default: null, trim: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

invoiceSchema.index({ organization_id: 1, invoice_date: -1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
