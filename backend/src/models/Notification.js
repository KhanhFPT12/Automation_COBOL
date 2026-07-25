const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'meeting_approved',
        'meeting_rejected',
        'meeting_cancelled',
        'meeting_reminder',
        'meeting_completed',
        'payment_success',
        'payment_success_admin',
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    meeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meeting',
      default: null,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      default: null,
    },
    eventKey: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ eventKey: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Notification', notificationSchema);
