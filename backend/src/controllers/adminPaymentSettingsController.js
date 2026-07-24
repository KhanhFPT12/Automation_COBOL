const BankAccountSettings = require('../models/BankAccountSettings');

const serialize = (settings) => settings ? {
  bin: settings.bin,
  accountNumber: settings.account_number,
  accountName: settings.account_name,
  updatedAt: settings.updated_at,
} : null;

exports.getBankAccount = async (_req, res, next) => {
  try {
    const settings = await BankAccountSettings.findOne({ key: 'primary' }).lean();
    return res.status(200).json({ success: true, data: serialize(settings) });
  } catch (error) {
    return next(error);
  }
};

exports.updateBankAccount = async (req, res, next) => {
  try {
    const bin = String(req.body.bin || '').trim();
    const accountNumber = String(req.body.accountNumber || '').trim();
    const accountName = String(req.body.accountName || '').trim();
    if (!/^\d{6}$/.test(bin) || !/^\d{6,30}$/.test(accountNumber) || !accountName) {
      return res.status(400).json({ success: false, message: 'Enter a 6-digit bank BIN, a valid account number, and account name.' });
    }
    const settings = await BankAccountSettings.findOneAndUpdate(
      { key: 'primary' },
      { $set: { bin, account_number: accountNumber, account_name: accountName, updated_by: req.user._id } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, message: 'Receiving bank account saved.', data: serialize(settings) });
  } catch (error) {
    return next(error);
  }
};
