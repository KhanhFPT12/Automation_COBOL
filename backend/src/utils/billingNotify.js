const Notification = require('../models/Notification');
const User = require('../models/User');
const { emitNotification } = require('../services/socketService');

/** Create an idempotent billing notification. Best-effort: never throws. */
async function notifyBillingEvent({ user, type, title, message, invoice = null, subscription = null, eventKey }) {
  try {
    const payload = { user, type, title, message, invoice, subscription };
    if (eventKey) {
      const notification = await Notification.findOneAndUpdate(
        { eventKey },
        { $setOnInsert: { ...payload, eventKey } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      emitNotification(user, notification.toJSON());
      return;
    }
    const notification = await Notification.create(payload);
    emitNotification(user, notification.toJSON());
  } catch (error) {
    // Duplicate-key races are expected when webhook and polling overlap.
    if (error?.code !== 11000) console.warn(`Failed to create "${type}" notification:`, error.message);
  }
}

/** Fan out one idempotent billing event to every active platform admin. */
async function notifyAdminsBillingEvent({ type, title, message, invoice = null, subscription = null, eventKey }) {
  try {
    const admins = await User.find({ role: 'ADMIN', isActive: { $ne: false } }).select('_id').lean();
    await Promise.all(admins.map((admin) => notifyBillingEvent({
      user: admin._id,
      type,
      title,
      message,
      invoice,
      subscription,
      eventKey: `${eventKey}:${admin._id}`,
    })));
  } catch (error) {
    console.warn(`Failed to notify admins about "${type}":`, error.message);
  }
}

module.exports = { notifyBillingEvent, notifyAdminsBillingEvent };
