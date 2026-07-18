const User = require('../models/User');
const Meeting = require('../models/Meeting');
const ConversionLog = require('../models/ConversionLog');

const EDITABLE_FIELDS = [
  'fullName',
  'companyName',
  'phone',
  'representativeName',
  'representativePosition',
  'companySize',
  'industry',
  'credits',
];

// ALSM platform admins are staff, not customers - they're excluded from
// every "users" view/count/count (User Management list, dashboard totals,
// activity feed) and cannot be locked/unlocked/deleted through this API.
const NOT_ADMIN = { role: { $ne: 'ADMIN' } };

// ────────────────────────────────────────────────────────────────
// @desc    List users - search by name/email/company + pagination
// @route   GET /api/admin/users
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.listUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = { ...NOT_ADMIN };
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [
        { fullName: re },
        { email: re },
        { companyName: re },
        { businessEmail: re },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      users,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error('listUsers error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Get one user's detail: profile + conversion history + meeting history
// @route   GET /api/admin/users/:id
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.getUserDetail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, ...NOT_ADMIN });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const [conversionHistory, meetingHistory] = await Promise.all([
      ConversionLog.find({ user: user._id }).sort({ createdAt: -1 }).limit(50),
      Meeting.find({ user: user._id }).sort({ createdAt: -1 }),
    ]);

    // No payment/billing system exists yet - always return an empty list so
    // the frontend can render the same "history" UI without a special case.
    const paymentHistory = [];

    return res.status(200).json({
      success: true,
      user,
      conversionHistory,
      meetingHistory,
      paymentHistory,
    });
  } catch (err) {
    console.error('getUserDetail error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Update editable user fields
// @route   PATCH /api/admin/users/:id
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.updateUser = async (req, res) => {
  try {
    const updates = {};
    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findOneAndUpdate({ _id: req.params.id, ...NOT_ADMIN }, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, message: 'User updated.', user });
  } catch (err) {
    console.error('updateUser error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Lock (deactivate) a user account
// @route   PATCH /api/admin/users/:id/lock
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.lockUser = async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot lock your own account.' });
    }
    const user = await User.findOneAndUpdate({ _id: req.params.id, ...NOT_ADMIN }, { isActive: false }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, message: 'Account locked.', user });
  } catch (err) {
    console.error('lockUser error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Unlock (reactivate) a user account
// @route   PATCH /api/admin/users/:id/unlock
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.unlockUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id, ...NOT_ADMIN }, { isActive: true }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, message: 'Account unlocked.', user });
  } catch (err) {
    console.error('unlockUser error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Delete a user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }
    const user = await User.findOneAndDelete({ _id: req.params.id, ...NOT_ADMIN });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (err) {
    console.error('deleteUser error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
