const mongoose = require('mongoose');

// Singleton collection (at most one document) holding the OAuth tokens for
// the single Google account an admin connects via Settings -> Google
// Calendar, used to auto-create Meet links when approving meetings.
const googleIntegrationSchema = new mongoose.Schema(
  {
    connectedEmail: { type: String, default: '' },
    refreshToken: { type: String, select: false },
    accessToken: { type: String, select: false },
    accessTokenExpiry: { type: Date },
    connectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GoogleIntegration', googleIntegrationSchema);
