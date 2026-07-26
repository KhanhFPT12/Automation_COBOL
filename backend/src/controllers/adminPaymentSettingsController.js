const BankAccountSettings = require('../models/BankAccountSettings');
const BankAccountAuditLog = require('../models/BankAccountAuditLog');
const Plan = require('../models/Plan');
const Invoice = require('../models/Invoice');
const Subscription = require('../models/Subscription');

const serialize = (account) => account ? {
  id: account._id,
  bin: account.bin,
  accountNumber: account.account_number,
  accountName: account.account_name,
  isDefault: account.is_default,
  updatedAt: account.updated_at,
} : null;

// GET /settings/bank-account -> Lists all bank accounts
exports.getBankAccounts = async (_req, res, next) => {
  try {
    const accounts = await BankAccountSettings.find().sort({ is_default: -1, createdAt: 1 });
    return res.status(200).json({ success: true, data: accounts.map(serialize) });
  } catch (error) {
    return next(error);
  }
};

// POST /settings/bank-account -> Create bank account
exports.createBankAccount = async (req, res, next) => {
  try {
    const bin = String(req.body.bin || '').trim();
    const accountNumber = String(req.body.accountNumber || '').trim();
    const accountName = String(req.body.accountName || '').trim();
    const isDefault = Boolean(req.body.isDefault);

    if (!/^\d{6}$/.test(bin) || !/^\d{6,30}$/.test(accountNumber) || !accountName) {
      return res.status(400).json({ success: false, message: 'Enter a valid 6-digit bank BIN, account number, and account holder name.' });
    }

    // If this is the first account, it should automatically be default
    const count = await BankAccountSettings.countDocuments();
    const shouldBeDefault = count === 0 ? true : isDefault;

    const account = new BankAccountSettings({
      bin,
      account_number: accountNumber,
      account_name: accountName,
      is_default: shouldBeDefault,
      updated_by: req.user._id,
    });

    if (shouldBeDefault) {
      await BankAccountSettings.updateMany({}, { $set: { is_default: false } });
    }

    await account.save();

    // Log audit
    await BankAccountAuditLog.create({
      action: 'create',
      bank_account_id: account._id,
      description: `Added new bank account: ${accountName} - ${accountNumber} (${bin})${shouldBeDefault ? ' as default' : ''}.`,
      performed_by: req.user._id,
      ip_address: req.ip || '',
    });

    return res.status(201).json({ success: true, message: 'Successfully added new bank account.', data: serialize(account) });
  } catch (error) {
    return next(error);
  }
};

// PUT /settings/bank-account/:id -> Update specific bank account
exports.updateBankAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bin = String(req.body.bin || '').trim();
    const accountNumber = String(req.body.accountNumber || '').trim();
    const accountName = String(req.body.accountName || '').trim();

    if (!/^\d{6}$/.test(bin) || !/^\d{6,30}$/.test(accountNumber) || !accountName) {
      return res.status(400).json({ success: false, message: 'Enter a valid 6-digit bank BIN, account number, and account holder name.' });
    }

    const account = await BankAccountSettings.findById(id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Bank account not found.' });
    }

    const oldNum = account.account_number;
    const oldName = account.account_name;
    const oldBin = account.bin;

    account.bin = bin;
    account.account_number = accountNumber;
    account.account_name = accountName;
    account.updated_by = req.user._id;
    await account.save();

    // Log audit
    await BankAccountAuditLog.create({
      action: 'update',
      bank_account_id: account._id,
      description: `Updated bank account from [${oldName} - ${oldNum} (BIN: ${oldBin})] to [${accountName} - ${accountNumber} (BIN: ${bin})].`,
      performed_by: req.user._id,
      ip_address: req.ip || '',
    });

    return res.status(200).json({ success: true, message: 'Successfully updated bank account.', data: serialize(account) });
  } catch (error) {
    return next(error);
  }
};

// DELETE /settings/bank-account/:id -> Delete bank account
exports.deleteBankAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await BankAccountSettings.findById(id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Bank account not found.' });
    }

    const wasDefault = account.is_default;
    await BankAccountSettings.deleteOne({ _id: id });

    // Log audit
    await BankAccountAuditLog.create({
      action: 'delete',
      bank_account_id: account._id,
      description: `Deleted bank account: ${account.account_name} - ${account.account_number} (${account.bin}).`,
      performed_by: req.user._id,
      ip_address: req.ip || '',
    });

    // If the deleted account was default, set another account as default if exists
    if (wasDefault) {
      const nextDefault = await BankAccountSettings.findOne();
      if (nextDefault) {
        nextDefault.is_default = true;
        await nextDefault.save();

        await BankAccountAuditLog.create({
          action: 'set_default',
          bank_account_id: nextDefault._id,
          description: `Automatically set bank account ${nextDefault.account_name} - ${nextDefault.account_number} as default after deleting the old default account.`,
          performed_by: req.user._id,
          ip_address: req.ip || '',
        });
      }
    }

    return res.status(200).json({ success: true, message: 'Successfully deleted bank account.' });
  } catch (error) {
    return next(error);
  }
};

// PATCH /settings/bank-account/:id/default -> Set default
exports.setDefaultBankAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await BankAccountSettings.findById(id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Bank account not found.' });
    }

    if (account.is_default) {
      return res.status(200).json({ success: true, message: 'This bank account is already the default.', data: serialize(account) });
    }

    // Set all others to false
    await BankAccountSettings.updateMany({}, { $set: { is_default: false } });

    account.is_default = true;
    account.updated_by = req.user._id;
    await account.save();

    // Log audit
    await BankAccountAuditLog.create({
      action: 'set_default',
      bank_account_id: account._id,
      description: `Set bank account ${account.account_name} - ${account.account_number} (${account.bin}) as default receiver.`,
      performed_by: req.user._id,
      ip_address: req.ip || '',
    });

    return res.status(200).json({ success: true, message: 'Successfully set new default bank account.', data: serialize(account) });
  } catch (error) {
    return next(error);
  }
};

// GET /settings/bank-account/audit-logs -> Get audit logs
exports.getAuditLogs = async (_req, res, next) => {
  try {
    const logs = await BankAccountAuditLog.find()
      .populate('performed_by', 'first_name last_name email')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      success: true,
      data: logs.map(log => ({
        id: log._id,
        action: log.action,
        description: log.description,
        performedBy: log.performed_by ? `${log.performed_by.first_name || ''} ${log.performed_by.last_name || ''} (${log.performed_by.email})`.trim() : 'System',
        createdAt: log.created_at || log.createdAt,
        ipAddress: log.ip_address,
      })),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /settings/plans -> Lists all plans for config
exports.getPlans = async (_req, res, next) => {
  try {
    const plans = await Plan.find().sort({ display_order: 1 });
    return res.status(200).json({ success: true, data: plans });
  } catch (error) {
    return next(error);
  }
};

// PUT /settings/plans/:id -> Update plan properties
exports.updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      priceMonthly,
      priceYearly,
      currency,
      limits,
      features,
      isActive,
      badgeText,
      displayOrder,
    } = req.body;

    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Pricing plan not found.' });
    }

    const oldName = plan.name;
    const oldPrice = plan.price_monthly;

    if (name) plan.name = name;
    if (description !== undefined) plan.description = description;
    if (priceMonthly !== undefined) plan.price_monthly = priceMonthly;
    if (priceYearly !== undefined) plan.price_yearly = priceYearly;
    if (currency) plan.currency = currency;
    if (isActive !== undefined) plan.is_active = isActive;
    if (badgeText !== undefined) plan.badge_text = badgeText;
    if (displayOrder !== undefined) plan.display_order = displayOrder;

    if (limits) {
      if (limits.maxProjects !== undefined) plan.limits.max_projects = limits.maxProjects;
      if (limits.maxScreensPerMonth !== undefined) plan.limits.max_screens_per_month = limits.maxScreensPerMonth;
      if (limits.maxStorageGb !== undefined) plan.limits.max_storage_gb = limits.maxStorageGb;
      if (limits.maxTeamMembers !== undefined) plan.limits.max_team_members = limits.maxTeamMembers;
    }

    if (Array.isArray(features)) {
      plan.features = features;
    }

    await plan.save();

    // Log this action to the BankAccountAuditLog
    await BankAccountAuditLog.create({
      action: 'update_plan',
      description: `Updated pricing plan [${plan.name}]: Price changed from ${oldPrice} VND/month to ${plan.price_monthly} VND/month. Project Limit: ${plan.limits.max_projects}, Screens/Month: ${plan.limits.max_screens_per_month}.`,
      performed_by: req.user._id,
      ip_address: req.ip || '',
    });

    return res.status(200).json({ success: true, message: 'Successfully updated pricing plan configuration.', data: plan });
  } catch (error) {
    return next(error);
  }
};

// GET /settings/invoices -> Lists all customer invoices
exports.getInvoices = async (_req, res, next) => {
  try {
    const invoices = await Invoice.find()
      .populate('organization_id', 'fullName companyName representativeName email businessEmail')
      .populate('pending_plan_id', 'name')
      .sort({ created_at: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: invoices.map((inv) => {
        const u = inv.organization_id;
        const customerEmail = u ? (u.email || u.businessEmail || 'Unknown') : 'Unknown';
        const customerName = u
          ? (u.fullName || u.companyName || u.representativeName || (customerEmail !== 'Unknown' ? customerEmail.split('@')[0] : 'Customer'))
          : 'Customer';

        return {
          id: inv._id,
          invoiceNumber: inv.invoice_number,
          amount: inv.amount,
          total: inv.total,
          currency: inv.currency,
          status: Invoice.InvoiceStatusNames[inv.status] || 'draft',
          paymentReference: inv.payment_reference,
          createdAt: inv.created_at,
          paidAt: inv.paid_at,
          customerEmail,
          customerName,
          pendingPlanName: inv.pending_plan_id ? inv.pending_plan_id.name : 'Subscription',
          pdfUrl: inv.pdf_url,
        };
      }),
    });
  } catch (error) {
    return next(error);
  }
};

// POST /settings/invoices/:id/confirm -> Manually confirm payment for an invoice
exports.confirmInvoicePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findOne({ _id: id, status: Invoice.InvoiceStatus.OPEN });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice does not exist or has already been paid/cancelled.' });
    }

    const plan = await Plan.findById(invoice.pending_plan_id);
    if (!plan) {
      return res.status(400).json({ success: false, message: 'The subscription plan for this invoice is not available.' });
    }

    // Set invoice as paid
    invoice.status = Invoice.InvoiceStatus.PAID;
    invoice.paid_at = new Date();
    invoice.payment_provider = 'admin_manual';
    await invoice.save();

    // Activate subscription
    const periodStart = new Date();
    const periodEnd = new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    await Subscription.findByIdAndUpdate(invoice.subscription_id, {
      $set: {
        plan_id: plan._id,
        plan_name: plan.name,
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: false,
        cancellation_reason: null,
        cancellation_requested_at: null,
        payment_provider: 'admin_manual',
        'usage.screens_converted_this_month': 0,
        'usage.last_calculated_at': periodStart,
      },
    });

    try {
      const { generateInvoicePdf } = require('../services/invoicePdfService');
      await generateInvoicePdf(invoice);
      invoice.pdf_url = `/api/invoices/${invoice._id}/pdf`;
      await invoice.save();
    } catch (pdfError) {
      console.error(`Unable to generate PDF for manual paid invoice ${invoice.invoice_number}:`, pdfError);
    }

    // Add audit log entry
    await BankAccountAuditLog.create({
      action: 'confirm_payment',
      description: `Admin manually confirmed payment for invoice ${invoice.invoice_number} (Plan ${plan.name}, amount: ${invoice.total} ${invoice.currency})`,
      performed_by: req.user._id,
      ip_address: req.ip || '',
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully confirmed invoice payment manually.',
      data: invoice,
    });
  } catch (error) {
    return next(error);
  }
};
