const mongoose = require("mongoose");

const chatAttachmentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, default: "document" }, // "image" | "document"
  fileSize: { type: Number, default: 0 },
});

const chatMessageSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  senderEmail: { type: String, required: true },
  senderRole: { type: String, enum: ["USER", "ADMIN"], required: true },
  senderName: { type: String },
  message: { type: String, default: "", trim: true },
  attachments: [chatAttachmentSchema],
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
