const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');

const DEFAULT_PERIOD_MS = 30 * 24 * 60 * 60 * 1000;

const ensureStarterSubscription = async (userId) => {
  const existingSubscription = await Subscription.findOne({ user_id: userId });
  if (existingSubscription) return existingSubscription;

  const starterPlan = await Plan.findOne({ slug: 'starter', is_active: true });
  if (!starterPlan) {
    const error = new Error('The default Starter plan is not available.');
    error.status = 503;
    throw error;
  }

  const periodStart = new Date();
  const periodEnd = new Date(periodStart.getTime() + DEFAULT_PERIOD_MS);

  return Subscription.create({
    user_id: userId,
    plan_id: starterPlan._id,
    plan_name: starterPlan.name,
    status: 'active',
    current_period_start: periodStart,
    current_period_end: periodEnd,
    usage: {},
  });
};

module.exports = { ensureStarterSubscription };
