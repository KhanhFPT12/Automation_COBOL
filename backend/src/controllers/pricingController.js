const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const { ensureStarterSubscription } = require('../services/subscriptionService');

const TRIAL_DURATION_MS = 14 * 24 * 60 * 60 * 1000;
const UPGRADE_PERIOD_MS = 30 * 24 * 60 * 60 * 1000;
const TRIAL_PLAN_SLUGS = new Set(['professional']);

const serializePlan = (plan) => ({
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
});

const findUpgrade = async (userId, planSlug) => {
  const subscription = await Subscription.findOne({ user_id: userId, status: 'active' });
  if (!subscription) {
    const error = new Error('An active subscription is required to upgrade.');
    error.status = 409;
    throw error;
  }

  const [currentPlan, targetPlan] = await Promise.all([
    Plan.findById(subscription.plan_id),
    Plan.findOne({ slug: planSlug, is_active: true }),
  ]);
  if (!currentPlan || !targetPlan) {
    const error = new Error('Selected plan is not available.');
    error.status = 404;
    throw error;
  }
  if (targetPlan.display_order <= currentPlan.display_order) {
    const error = new Error('You can only select a plan higher than your current plan.');
    error.status = 400;
    throw error;
  }

  return { subscription, currentPlan, targetPlan };
};

const calculateUpgradeCharge = (targetPlan) => {
  const periodStart = new Date();
  return {
    amountDue: Number(targetPlan.price_monthly || 0),
    currency: targetPlan.currency,
    periodStart,
    periodEnd: new Date(periodStart.getTime() + UPGRADE_PERIOD_MS),
  };
};

exports.getPlans = async (_req, res, next) => {
  try {
    const plans = await Plan.find({ is_active: true })
      .sort({ display_order: 1 })
      .lean();

    const data = plans.map(serializePlan);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

exports.getBilling = async (req, res, next) => {
  try {
    let subscription = await Subscription.findOne({ user_id: req.user._id, status: 'active' });
    if (!subscription) {
      await ensureStarterSubscription(req.user._id);
      subscription = await Subscription.findOne({ user_id: req.user._id, status: 'active' });
    }
    if (!subscription) {
      return res.status(409).json({
        success: false,
        message: 'An active subscription is required to upgrade.',
      });
    }

    const currentPlan = await Plan.findById(subscription.plan_id);
    if (!currentPlan) {
      return res.status(404).json({ success: false, message: 'Current plan is not available.' });
    }
    const upgrades = await Plan.find({
      is_active: true,
      display_order: { $gt: currentPlan.display_order },
    }).sort({ display_order: 1 });

    return res.status(200).json({
      success: true,
      data: {
        subscription: {
          id: subscription._id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
        },
        currentPlan: serializePlan(currentPlan),
        availableUpgrades: upgrades.map(serializePlan),
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.previewUpgrade = async (req, res, next) => {
  try {
    const planSlug = String(req.body.planId || '').trim().toLowerCase();
    const { currentPlan, targetPlan } = await findUpgrade(req.user._id, planSlug);

    // The upgrade starts a new 30-day billing period immediately. Stripe will
    // replace this temporary charge calculation when payment is connected.
    const charge = calculateUpgradeCharge(targetPlan);
    return res.status(200).json({
      success: true,
      data: {
        currentPlan: serializePlan(currentPlan),
        targetPlan: serializePlan(targetPlan),
        charge,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.confirmUpgrade = async (req, res, next) => {
  try {
    const planSlug = String(req.body.planId || '').trim().toLowerCase();
    const { subscription, currentPlan, targetPlan } = await findUpgrade(req.user._id, planSlug);
    const charge = calculateUpgradeCharge(targetPlan);

    // Temporary payment boundary for UC-21. Stripe will replace this explicit
    // confirmation flag; the subscription update deliberately remains below it.
    if (req.body.paymentConfirmed !== true) {
      return res.status(402).json({
        success: false,
        message: 'Payment was not confirmed. Your current plan has not changed.',
      });
    }

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { _id: subscription._id, status: 'active', plan_id: currentPlan._id },
      {
        $set: {
          plan_id: targetPlan._id,
          plan_name: targetPlan.name,
          current_period_start: charge.periodStart,
          current_period_end: charge.periodEnd,
        },
      },
      { new: true }
    );
    if (!updatedSubscription) {
      return res.status(409).json({
        success: false,
        message: 'Subscription changed while upgrading. No plan change was applied.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Your subscription has been upgraded to ${targetPlan.name}.`,
      data: {
        subscription: {
          id: updatedSubscription._id,
          status: updatedSubscription.status,
          currentPeriodEnd: updatedSubscription.current_period_end,
        },
        plan: serializePlan(targetPlan),
        charge,
      },
    });
  } catch (error) {
    return next(error);
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
