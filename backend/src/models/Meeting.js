const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ─── Requester details (captured at booking time so the record stays
    // meaningful even if the user later edits their profile) ──────────
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true, default: '' },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },

    // ─── Meeting details ───────────────────────────────────────────
    topic: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true, trim: true }, // "HH:mm"
    timeZone: { type: String, required: true, trim: true },
    duration: {
      type: Number,
      enum: [30, 60, 90],
      required: true,
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    rejectionReason: { type: String, trim: true, default: '' },

    // ─── Filled in once approved ───────────────────────────────────
    meetingLink: { type: String, default: '' },
    googleEventId: { type: String, default: '' },

    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

meetingSchema.index({ user: 1, createdAt: -1 });
meetingSchema.index({ status: 1 });

module.exports = mongoose.model('Meeting', meetingSchema);
