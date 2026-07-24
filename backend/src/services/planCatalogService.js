const Plan = require('../models/Plan');

// Temporary commercial values requested for the first bank-transfer rollout.
// Keep them here so they can be changed without touching payment logic.
const DEFAULT_PLANS = [
  {
    name: 'Starter', slug: 'starter', description: 'A small evaluation workspace.',
    price_monthly: 0, price_yearly: 0, currency: 'VND', display_order: 0,
    limits: { max_projects: 1, max_screens_per_month: 1, max_storage_gb: 1, max_team_members: 1 },
    features: ['Convert 1 screen per month'], is_active: true, badge_text: '',
  },
  {
    name: 'Professional', slug: 'professional', description: '14-day free trial with a limited conversion allowance.',
    price_monthly: 0, price_yearly: 0, currency: 'VND', display_order: 1,
    limits: { max_projects: 1, max_screens_per_month: 1, max_storage_gb: 1, max_team_members: 1 },
    features: ['14-day free trial', 'Convert 1 screen per month'], is_active: true, badge_text: 'Free trial',
  },
  {
    name: 'Enterprise', slug: 'enterprise', description: 'Bank-transfer subscription for larger modernization work.',
    price_monthly: 10000, price_yearly: 120000, currency: 'VND', display_order: 2,
    limits: { max_projects: 5, max_screens_per_month: 20, max_storage_gb: 10, max_team_members: 5 },
    features: ['Convert up to 20 screens per month', 'Priority conversion support'], is_active: true, badge_text: '20 screens',
  },
];

const ensureDefaultPlans = async () => {
  for (const plan of DEFAULT_PLANS) {
    await Plan.updateOne({ slug: plan.slug }, { $set: plan }, { upsert: true });
  }
};

module.exports = { ensureDefaultPlans };
