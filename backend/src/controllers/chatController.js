const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const { uploadToCloudinary } = require("../services/cloudinaryService");

/**
 * GET /api/chat/conversations
 * Admin endpoint: Retrieves only users who have active chat messages.
 */
exports.getConversations = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Forbidden." });
    }

    const conversations = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$userEmail",
          lastMessage: { $first: "$message" },
          lastSenderName: { $first: "$senderName" },
          lastSenderRole: { $first: "$senderRole" },
          lastAt: { $first: "$createdAt" },
          attachmentsCount: { $first: { $size: { $ifNull: ["$attachments", []] } } },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$senderRole", "USER"] }, { $eq: ["$isRead", false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastAt: -1 } },
    ]);

    const userEmails = conversations.map((c) => c._id);
    const usersMap = {};
    const dbUsers = await User.find({
      $or: [
        { email: { $in: userEmails } },
        { businessEmail: { $in: userEmails } },
      ],
    }).lean();

    dbUsers.forEach((u) => {
      if (u.email) usersMap[u.email.toLowerCase()] = u;
      if (u.businessEmail) usersMap[u.businessEmail.toLowerCase()] = u;
    });

    const result = conversations.map((c) => {
      const emailLower = (c._id || "").toLowerCase();
      const u = usersMap[emailLower] || {};
      let snippet = c.lastMessage || "";
      if (!snippet && c.attachmentsCount > 0) {
        snippet = "📎 Attached file";
      }
      return {
        email: c._id,
        fullName: u.fullName || c.lastSenderName || c._id,
        avatar: u.avatar || null,
        lastMessage: snippet,
        lastSenderRole: c.lastSenderRole,
        lastAt: c.lastAt,
        unreadCount: c.unreadCount,
      };
    });

    return res.json({ success: true, conversations: result });
  } catch (err) {
    console.error("getConversations error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * GET /api/chat/messages/:userId
 */
exports.getMessages = async (req, res) => {
  try {
    const userEmail = req.params.userId;
    const messages = await ChatMessage.find({ userEmail }).sort({ createdAt: 1 }).limit(300).lean();
    const isAdmin = req.user.role === "ADMIN";
    const unreadCount = messages.filter((message) =>
      message.isRead === false && message.senderRole === (isAdmin ? "USER" : "ADMIN")
    ).length;
    return res.json({ success: true, messages, unreadCount });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * GET /api/chat/unread
 */
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

/**
 * PATCH /api/chat/read/:userId
 */
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

/**
 * POST /api/chat/upload
 * Uploads attachment to Cloudinary
 */
exports.uploadAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }
    const { buffer, originalname, mimetype, size } = req.file;

    let attachment;
    try {
      // 1. Primary: Upload to Cloudinary
      const result = await uploadToCloudinary(buffer, originalname, mimetype);
      attachment = {
        url: result.url,
        fileName: originalname,
        fileType: result.resourceType,
        fileSize: size,
      };
    } catch (cloudErr) {
      console.warn("Cloudinary upload failed, using local storage fallback:", cloudErr.message || cloudErr);

      // 2. Fallback: Save to local uploads folder
      const fs = require("fs");
      const path = require("path");
      const uploadsDir = path.join(__dirname, "../../public/uploads/chat");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const safeName = `${Date.now()}_${originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);

      const baseUrl = process.env.API_URL || "http://localhost:5000";
      const isImage = mimetype && mimetype.startsWith("image/");
      attachment = {
        url: `${baseUrl}/uploads/chat/${safeName}`,
        fileName: originalname,
        fileType: isImage ? "image" : "document",
        fileSize: size,
      };
    }

    return res.json({
      success: true,
      attachment,
    });
  } catch (err) {
    console.error("uploadAttachment error:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to upload file." });
  }
};

/**
 * POST /api/chat/send
 */
exports.sendMessage = async (req, res) => {
  try {
    const { userEmail, message, attachments } = req.body;
    const hasText = message && message.trim().length > 0;
    const hasAttachments = Array.isArray(attachments) && attachments.length > 0;

    if (!userEmail || (!hasText && !hasAttachments)) {
      return res.status(400).json({ success: false, message: "Message text or attachment is required." });
    }
    const isAdmin = req.user.role === "ADMIN";
    const senderName = isAdmin ? "Admin" : (req.user.fullName || req.user.email);
    const msg = await ChatMessage.create({
      userEmail,
      senderEmail: req.user.email || req.user.businessEmail,
      senderRole: isAdmin ? "ADMIN" : "USER",
      senderName,
      message: hasText ? message.trim() : "",
      attachments: hasAttachments ? attachments : [],
    });

    // Emit Socket.IO event if available
    try {
      const socketService = require("../services/socketService");
      if (socketService.emitChatMessage) {
        socketService.emitChatMessage(msg);
      }
    } catch { /* ignore if socket is not bound */ }

    return res.status(201).json({ success: true, message: msg });
  } catch (err) {
    console.error("sendMessage error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
