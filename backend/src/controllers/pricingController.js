const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Invoice = require('../models/Invoice');
const BankAccountSettings = require('../models/BankAccountSettings');
const { ensureStarterSubscription, cancelExpiredSubscriptions } = require('../services/subscriptionService');
const { generateInvoicePdf } = require('../services/invoicePdfService');
const { notifyBillingEvent, notifyAdminsBillingEvent } = require('../utils/billingNotify');

const generatePaymentReference = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let reference = '';
  let isUnique = false;
  while (!isUnique) {
    reference = 'ALSM';
    for (let i = 0; i < 8; i++) {
      reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const exists = await Invoice.exists({ payment_reference: reference });
    if (!exists) {
      isUnique = true;
    }
  }
  return reference;
};

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
  const subscription = await Subscription.findOne({
    user_id: userId,
    status: { $in: ['trialing', 'active'] },
    current_period_end: { $gt: new Date() },
  });
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

const createInvoiceNumber = (userId) => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const accountSuffix = userId.toString().slice(-6).toUpperCase();
  return `INV-${timestamp}-${accountSuffix}`;
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
    await cancelExpiredSubscriptions();
    let subscription = await Subscription.findOne({
      user_id: req.user._id,
      status: { $in: ['trialing', 'active'] },
      current_period_end: { $gt: new Date() },
    });
    if (!subscription) {
      await ensureStarterSubscription(req.user._id);
      subscription = await Subscription.findOne({
        user_id: req.user._id,
        status: { $in: ['trialing', 'active'] },
        current_period_end: { $gt: new Date() },
      });
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
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          cancellationReason: subscription.cancellation_reason,
        },
        currentPlan: serializePlan(currentPlan),
        availableUpgrades: upgrades.map(serializePlan),
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    await cancelExpiredSubscriptions();
    const reason = String(req.body.reason || '').trim();
    if (reason.length > 500) {
      return res.status(400).json({ success: false, message: 'Cancellation reason cannot exceed 500 characters.' });
    }

    const subscription = await Subscription.findOneAndUpdate(
      {
        user_id: req.user._id,
        status: 'active',
        current_period_end: { $gt: new Date() },
        cancel_at_period_end: false,
      },
      {
        $set: {
          cancel_at_period_end: true,
          cancellation_reason: reason || null,
          cancellation_requested_at: new Date(),
        },
      },
      { new: true }
    );

    if (!subscription) {
      return res.status(409).json({
        success: false,
        message: 'Only an active, renewing subscription can be canceled.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Your subscription will end on ${subscription.current_period_end.toLocaleDateString('en-US')}.`,
      data: {
        subscription: {
          id: subscription._id,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          cancellationReason: subscription.cancellation_reason,
        },
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

    // If amountDue is 0, we can immediately activate
    if (charge.amountDue === 0) {
      const updatedSubscription = await Subscription.findOneAndUpdate(
        { _id: subscription._id, status: subscription.status, plan_id: currentPlan._id },
        {
          $set: {
            plan_id: targetPlan._id,
            plan_name: targetPlan.name,
            status: 'active',
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

      const paidAt = new Date();
      const invoice = await Invoice.create({
        organization_id: req.user._id,
        organization_uuid: req.user._id.toString(),
        subscription_id: updatedSubscription._id,
        invoice_number: createInvoiceNumber(req.user._id),
        amount: charge.amountDue,
        currency: charge.currency,
        tax_rate: 0,
        tax_amount: 0,
        total: charge.amountDue,
        status: 'paid',
        line_items: [
          {
            description: `${targetPlan.name} plan subscription`,
            quantity: 1,
            unit_price: charge.amountDue,
            amount: charge.amountDue,
            period_start: charge.periodStart,
            period_end: charge.periodEnd,
          },
        ],
        invoice_date: paidAt,
        due_date: paidAt,
        paid_at: paidAt,
        pdf_url: null,
      });

      try {
        await generateInvoicePdf(invoice);
        invoice.pdf_url = `/api/invoices/${invoice._id}/pdf`;
        await invoice.save();
      } catch (pdfError) {
        console.error(`Unable to generate PDF for invoice ${invoice.invoice_number}:`, pdfError);
      }

      // ── Notifications ────────────────────────────────────────────
      await Promise.all([
        notifyBillingEvent({
          user: req.user._id,
          type: 'payment_success',
          title: 'Plan upgraded',
          message: `Payment successful! Your account has been upgraded to the ${targetPlan.name} plan.`,
          invoice: invoice._id,
          subscription: updatedSubscription._id,
          eventKey: `free-upgrade-user:${invoice._id}`,
        }),
        notifyAdminsBillingEvent({
          type: 'payment_success_admin',
          title: 'User upgraded (free)',
          message: `${req.user.fullName || req.user.companyName || req.user.email} upgraded to the ${targetPlan.name} plan (free upgrade).`,
          invoice: invoice._id,
          subscription: updatedSubscription._id,
          eventKey: `free-upgrade-admin:${invoice._id}`,
        }),
      ]);

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
          invoice: {
            id: invoice._id,
            invoiceNumber: invoice.invoice_number,
            status: invoice.status,
            pdfStatus: invoice.pdf_url ? 'ready' : 'processing',
          },
        },
      });
    }

    // For paid upgrades, we require bank transfer via VietQR
    const bankSettings = await BankAccountSettings.findOne({ is_default: true }).lean()
      || await BankAccountSettings.findOne().lean();
    if (!bankSettings) {
      return res.status(400).json({
        success: false,
        message: "The platform's receiving bank account is not configured by the administrator. Please contact support.",
      });
    }

    let invoice = await Invoice.findOne({
      organization_id: req.user._id,
      status: Invoice.InvoiceStatus.OPEN,
      subscription_id: subscription._id,
    });

    if (invoice) {
      const expirationLimitMs = 15 * 60 * 1000;
      const isExpired = Date.now() - new Date(invoice.created_at).getTime() > expirationLimitMs;

      if (invoice.pending_plan_id.toString() !== targetPlan._id.toString() || isExpired) {
        invoice.status = Invoice.InvoiceStatus.VOID;
        await invoice.save();
        invoice = null;
      }
    }

    if (!invoice) {
      const paymentRef = await generatePaymentReference();
      invoice = await Invoice.create({
        organization_id: req.user._id,
        organization_uuid: req.user._id.toString(),
        subscription_id: subscription._id,
        invoice_number: createInvoiceNumber(req.user._id),
        amount: charge.amountDue,
        currency: charge.currency,
        tax_rate: 0,
        tax_amount: 0,
        total: charge.amountDue,
        status: Invoice.InvoiceStatus.OPEN,
        line_items: [
          {
            description: `${targetPlan.name} plan subscription`,
            quantity: 1,
            unit_price: charge.amountDue,
            amount: charge.amountDue,
            period_start: charge.periodStart,
            period_end: charge.periodEnd,
          },
        ],
        invoice_date: new Date(),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days due date
        payment_reference: paymentRef,
        pending_plan_id: targetPlan._id,
      });
    }

    // Generate VietQR URL
    const { generateVietQR } = require('../utils/emvco');
    const qrData = generateVietQR({
      bin: bankSettings.bin,
      accountNumber: bankSettings.account_number,
      accountName: bankSettings.account_name,
      amount: invoice.total,
      orderCode: invoice.payment_reference,
    });
    const vietQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

    return res.status(200).json({
      success: true,
      message: 'Invoice created. Please complete the bank transfer to activate your subscription.',
      data: {
        vietQrUrl,
        bankDetails: {
          bin: bankSettings.bin,
          accountNumber: bankSettings.account_number,
          accountName: bankSettings.account_name,
        },
        invoice: {
          id: invoice._id,
          invoiceNumber: invoice.invoice_number,
          status: Invoice.InvoiceStatusNames[invoice.status] || 'draft',
          total: invoice.total,
          currency: invoice.currency,
          paymentReference: invoice.payment_reference,
          pdfStatus: 'processing',
          invoiceDate: invoice.invoice_date,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.getTrialEligibility = async (req, res, next) => {
  try {
    const hasUsedTrial = await Subscription.exists({
      user_id: req.user._id,
      trial_start: { $ne: null },
    });

    return res.status(200).json({
      success: true,
      data: { eligible: !hasUsedTrial },
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

    const starterPlan = await Plan.findOne({ slug: 'starter' });
    const [plan, previousTrial, activeSubscription] = await Promise.all([
      Plan.findOne({ slug: planSlug, is_active: true }),
      Subscription.exists({ user_id: req.user._id, trial_start: { $ne: null } }),
      Subscription.exists({
        user_id: req.user._id,
        status: { $in: ['trialing', 'active'] },
        current_period_end: { $gt: new Date() },
        plan_id: { $ne: starterPlan ? starterPlan._id : null },
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
    const subscription = await Subscription.findOneAndUpdate(
      { user_id: req.user._id },
      {
        $set: {
          plan_id: plan._id,
          plan_name: plan.name,
          status: 'trialing',
          trial_start: trialStart,
          trial_end: trialEnd,
          current_period_start: trialStart,
          current_period_end: trialEnd,
          usage: {},
        },
      },
      { new: true, upsert: true }
    );

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
