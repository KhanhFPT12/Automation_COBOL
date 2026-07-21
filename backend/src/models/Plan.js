const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    price_monthly: { type: Number, default: null, min: 0 },
    price_yearly: { type: Number, default: null, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true },
    limits: {
      max_projects: { type: Number, default: null, min: 0 },
      max_screens_per_month: { type: Number, default: null, min: 0 },
      max_storage_gb: { type: Number, default: null, min: 0 },
      max_team_members: { type: Number, default: null, min: 0 },
    },
    features: [{ type: String, trim: true }],
    is_active: { type: Boolean, default: true },
    display_order: { type: Number, required: true, min: 0 },
    badge_text: { type: String, default: '', trim: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

planSchema.index({ is_active: 1, display_order: 1 });

module.exports = mongoose.model('Plan', planSchema);
