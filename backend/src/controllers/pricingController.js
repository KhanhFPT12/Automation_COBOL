const Plan = require('../models/Plan');

exports.getPlans = async (_req, res, next) => {
  try {
    const plans = await Plan.find({ is_active: true })
      .sort({ display_order: 1 })
      .lean();

    const data = plans.map((plan) => ({
      id: plan.slug,
      name: plan.name,
      description: plan.description,
      price: {
        amount: plan.price_monthly,
        yearlyAmount: plan.price_yearly,
        currency: plan.currency,
        interval: 'month',
      },
      limits: {
        projects: plan.limits.max_projects,
        screensPerMonth: plan.limits.max_screens_per_month,
        storageGb: plan.limits.max_storage_gb,
        teamMembers: plan.limits.max_team_members,
      },
      features: plan.features,
      highlighted: Boolean(plan.badge_text),
      badgeText: plan.badge_text,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
