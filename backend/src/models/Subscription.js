const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema(
  {
    projects_used: { type: Number, required: true, default: 0, min: 0 },
    screens_converted_this_month: { type: Number, required: true, default: 0, min: 0 },
    storage_used_mb: { type: Number, required: true, default: 0, min: 0 },
    last_calculated_at: { type: Date, required: true, default: Date.now },
  },
  { _id: false }
);

const subscriptionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    plan_name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['trialing', 'active', 'past_due', 'canceled', 'expired'],
      required: true,
    },
    trial_start: { type: Date, default: null },
    trial_end: { type: Date, default: null },
    current_period_start: { type: Date, required: true },
    current_period_end: { type: Date, required: true },
    cancel_at_period_end: { type: Boolean, required: true, default: false },
    usage: { type: usageSchema, required: true, default: () => ({}) },
    payment_provider: { type: String, required: true, default: 'none', trim: true },
    provider_subscription_id: { type: String, default: null, trim: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// A trial record is kept permanently, so this database constraint guarantees
// that an account cannot start a second trial even under concurrent requests.
subscriptionSchema.index(
  { user_id: 1 },
  {
    unique: true,
    partialFilterExpression: { trial_start: { $type: 'date' } },
    name: 'one_trial_per_user',
  }
);
subscriptionSchema.index({ user_id: 1, status: 1, current_period_end: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
