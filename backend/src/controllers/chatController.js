const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");

exports.getMessages = async (req, res) => {
  try {
    const userEmail = req.params.userId;
    const messages = await ChatMessage.find({ userEmail }).sort({ createdAt: 1 }).limit(200).lean();
    const isAdmin = req.user.role === "ADMIN";
    const unreadCount = messages.filter((message) =>
      message.isRead === false && message.senderRole === (isAdmin ? "USER" : "ADMIN")
    ).length;
    return res.json({ success: true, messages, unreadCount });
  } catch (err) { return res.status(500).json({ success: false, message: "Server error." }); }
};

exports.getUnread = async (req, res) => {
  try {
    const isAdmin = req.user.role === "ADMIN";
    if (isAdmin) {
      const rows = await ChatMessage.aggregate([
        { $match: { senderRole: "USER", isRead: false } },
        { $group: { _id: "$userEmail", count: { $sum: 1 } } },
      ]);
      const unreadByUser = Object.fromEntries(rows.map((row) => [row._id, row.count]));
      const total = rows.reduce((sum, row) => sum + row.count, 0);
      return res.json({ success: true, total, unreadByUser });
    }

    const userEmail = req.user.email || req.user.businessEmail;
    const total = await ChatMessage.countDocuments({ userEmail, senderRole: "ADMIN", isRead: false });
    return res.json({ success: true, total, unreadByUser: {} });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

exports.markRead = async (req, res) => {
  try {
    const isAdmin = req.user.role === "ADMIN";
    const ownEmail = req.user.email || req.user.businessEmail;
    const userEmail = isAdmin ? req.params.userId : ownEmail;
    await ChatMessage.updateMany(
      { userEmail, senderRole: isAdmin ? "USER" : "ADMIN", isRead: false },
      { $set: { isRead: true } },
    );
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
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
