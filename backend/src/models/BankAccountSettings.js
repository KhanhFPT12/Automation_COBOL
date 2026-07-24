const mongoose = require('mongoose');

const bankAccountSettingsSchema = new mongoose.Schema(
  {
    bin: { type: String, required: true, trim: true },
    account_number: { type: String, required: true, trim: true },
    account_name: { type: String, required: true, trim: true },
    is_default: { type: Boolean, default: false },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('BankAccountSettings', bankAccountSettingsSchema);
