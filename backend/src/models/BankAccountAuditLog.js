const mongoose = require('mongoose');

const bankAccountAuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // 'create', 'update', 'delete', 'set_default'
    bank_account_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    description: { type: String, required: true },
    performed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ip_address: { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('BankAccountAuditLog', bankAccountAuditLogSchema);
