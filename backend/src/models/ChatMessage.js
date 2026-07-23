const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  senderEmail: { type: String, required: true },
  senderRole: { type: String, enum: ["USER", "ADMIN"], required: true },
  senderName: { type: String },
  message: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
