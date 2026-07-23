const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");

exports.getMessages = async (req, res) => {
  try {
    const userEmail = req.params.userId;
    const messages = await ChatMessage.find({ userEmail }).sort({ createdAt: 1 }).limit(200).lean();
    return res.json({ success: true, messages });
  } catch (err) { return res.status(500).json({ success: false, message: "Server error." }); }
};

exports.sendMessage = async (req, res) => {
  try {
    const { userEmail, message } = req.body;
    if (!userEmail || !message || !message.trim()) {
      return res.status(400).json({ success: false, message: "userEmail and message are required." });
    }
    const isAdmin = req.user.role === "ADMIN";
    const senderName = isAdmin ? "Admin" : (req.user.fullName || req.user.email);
    const msg = await ChatMessage.create({
      userEmail,
      senderEmail: req.user.email || req.user.businessEmail,
      senderRole: isAdmin ? "ADMIN" : "USER",
      senderName,
      message: message.trim(),
    });
    return res.status(201).json({ success: true, message: msg });
  } catch (err) { console.error(err); return res.status(500).json({ success: false, message: "Server error." }); }
};
