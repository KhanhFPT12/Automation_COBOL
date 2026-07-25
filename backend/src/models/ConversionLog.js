const mongoose = require('mongoose');

// One row per BMS/DSPF conversion job run through /api/bms-converter/upload.
// Powers the "Conversion History" admin page and the "Conversions" stat on
// the dashboard. Logging is best-effort (see converterController.js) so a
// logging failure never breaks the actual conversion feature.
const conversionLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null = anonymous/unauthenticated conversion
    },
    fileType: {
      type: String,
      enum: ['bms', 'dspf'],
      required: true,
    },
    screenCount: { type: Number, default: 0 },
    success: { type: Boolean, required: true },
    errorMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

conversionLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ConversionLog', conversionLogSchema);
