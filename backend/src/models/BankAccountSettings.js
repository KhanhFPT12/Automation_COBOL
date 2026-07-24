const mongoose = require('mongoose');

// One platform-owned receiving account. It is editable only by platform
// admins and becomes the source of truth for newly generated VietQR payloads.
const bankAccountSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'primary' },
    bin: { type: String, required: true, trim: true },
    account_number: { type: String, required: true, trim: true },
    account_name: { type: String, required: true, trim: true },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('BankAccountSettings', bankAccountSettingsSchema);
