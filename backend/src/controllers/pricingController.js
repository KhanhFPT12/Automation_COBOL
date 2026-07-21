const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');

const TRIAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000;
const TRIAL_PLAN_SLUGS = new Set(['professional']);

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

exports.startTrial = async (req, res, next) => {
  try {
    const planSlug = String(req.body.planId || '').trim().toLowerCase();
    if (!TRIAL_PLAN_SLUGS.has(planSlug)) {
      return res.status(400).json({
        success: false,
        message: 'Free trial is only available for the Professional plan.',
      });
    }

    const [plan, previousTrial, activeSubscription] = await Promise.all([
      Plan.findOne({ slug: planSlug, is_active: true }),
      Subscription.exists({ user_id: req.user._id, trial_start: { $ne: null } }),
      Subscription.exists({
        user_id: req.user._id,
        status: { $in: ['trialing', 'active'] },
        current_period_end: { $gt: new Date() },
      }),
    ]);

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Selected plan is not available.' });
    }
    if (previousTrial) {
      return res.status(409).json({
        success: false,
        message: 'This account has already used its free trial.',
      });
    }
    if (activeSubscription) {
      return res.status(409).json({
        success: false,
        message: 'This account already has an active subscription.',
      });
    }

    const trialStart = new Date();
    const trialEnd = new Date(trialStart.getTime() + TRIAL_DURATION_MS);
    const subscription = await Subscription.create({
      user_id: req.user._id,
      plan_id: plan._id,
      plan_name: plan.name,
      status: 'trialing',
      trial_start: trialStart,
      trial_end: trialEnd,
      current_period_start: trialStart,
      current_period_end: trialEnd,
      usage: {},
    });

    return res.status(201).json({
      success: true,
      message: `Your 14-day ${plan.name} trial is now active.`,
      data: {
        id: subscription._id,
        planId: plan.slug,
        planName: subscription.plan_name,
        status: subscription.status,
        trialStart: subscription.trial_start,
        trialEnd: subscription.trial_end,
        currentPeriodEnd: subscription.current_period_end,
        usage: subscription.usage,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This account has already used its free trial.',
      });
    }
    return next(error);
  }
};
