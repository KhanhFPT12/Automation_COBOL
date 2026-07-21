const Notification = require('../models/Notification');

// ────────────────────────────────────────────────────────────────
// @desc    List the current user's notifications (newest first)
// @route   GET /api/notifications
// @access  Private
// ────────────────────────────────────────────────────────────────
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    return res.status(200).json({ success: true, notifications, unreadCount });
  } catch (err) {
    console.error('getMyNotifications error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Mark one notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
// ────────────────────────────────────────────────────────────────
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }
    return res.status(200).json({ success: true, notification });
  } catch (err) {
    console.error('markAsRead error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ────────────────────────────────────────────────────────────────
// @desc    Mark all of the current user's notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
// ────────────────────────────────────────────────────────────────
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('markAllAsRead error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
