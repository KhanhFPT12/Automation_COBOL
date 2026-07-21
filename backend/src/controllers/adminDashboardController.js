const User = require('../models/User');
const Meeting = require('../models/Meeting');
const ConversionLog = require('../models/ConversionLog');

function daysAgo(n) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

/** Group a collection's documents into per-day counts for the last `days` days. */
async function dailyCounts(Model, days, extraMatch = {}) {
  const since = daysAgo(days - 1);
  const rows = await Model.aggregate([
    { $match: { createdAt: { $gte: since }, ...extraMatch } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const map = new Map(rows.map((r) => [r._id, r.count]));

  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: map.get(key) || 0 });
  }
  return series;
}

// ────────────────────────────────────────────────────────────────
// @desc    Aggregate stats for the Admin Dashboard
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalMeetings,
      pendingMeetings,
      approvedMeetings,
      rejectedMeetings,
      cancelledMeetings,
      completedMeetings,
      totalConversions,
      meetingsPerDay,
      conversionsPerDay,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'ADMIN' } }),
      Meeting.countDocuments({}),
      Meeting.countDocuments({ status: 'Pending' }),
      Meeting.countDocuments({ status: 'Approved' }),
      Meeting.countDocuments({ status: 'Rejected' }),
      Meeting.countDocuments({ status: 'Cancelled' }),
      Meeting.countDocuments({ status: 'Completed' }),
      ConversionLog.countDocuments({ success: true }),
      dailyCounts(Meeting, 14),
      dailyCounts(ConversionLog, 14, { success: true }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalMeetings,
        pendingMeetings,
        approvedMeetings,
        rejectedMeetings,
        cancelledMeetings,
        completedMeetings,
        totalConversions,
      },
      charts: {
        meetingsPerDay,
        conversionsPerDay,
      },
    });
  } catch (err) {
    console.error('getStats error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Recent activity feed (new users, meeting requests/updates, conversions)
// @route   GET /api/admin/dashboard/activity
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.getRecentActivity = async (req, res) => {
  try {
    const [recentUsers, recentMeetings, recentConversions] = await Promise.all([
      User.find({ role: { $ne: 'ADMIN' } }).sort({ createdAt: -1 }).limit(10).select('fullName email companyName businessEmail createdAt'),
      Meeting.find({}).sort({ updatedAt: -1 }).limit(10).select('fullName topic status updatedAt'),
      ConversionLog.find({}).sort({ createdAt: -1 }).limit(10).populate('user', 'fullName email'),
    ]);

    const activity = [
      ...recentUsers.map((u) => ({
        type: 'user_registered',
        message: `${u.fullName || u.companyName || u.email || u.businessEmail} registered an account`,
        timestamp: u.createdAt,
      })),
      ...recentMeetings.map((m) => ({
        type: 'meeting_update',
        message: `Meeting "${m.topic}" by ${m.fullName} is now ${m.status}`,
        timestamp: m.updatedAt,
      })),
      ...recentConversions.map((c) => ({
        type: 'conversion',
        message: `${c.user ? (c.user.fullName || c.user.email) : 'Anonymous'} converted ${c.screenCount} ${c.fileType.toUpperCase()} screen(s)`,
        timestamp: c.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);

    return res.status(200).json({ success: true, activity });
  } catch (err) {
    console.error('getRecentActivity error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Conversion history list (Reports / Conversion History page)
// @route   GET /api/admin/conversions
// @access  Private/Admin
// ────────────────────────────────────────────────────────────────
exports.listConversions = async (req, res) => {
  try {
    const { page = 1, limit = 20, fileType } = req.query;
    const filter = {};
    if (fileType && fileType !== 'all') filter.fileType = fileType;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const [conversions, total] = await Promise.all([
      ConversionLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('user', 'fullName email companyName businessEmail'),
      ConversionLog.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      conversions,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error('listConversions error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
