const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

router.get("/conversations", protect, chatController.getConversations);
router.get("/unread", protect, chatController.getUnread);
router.patch("/read/:userId", protect, chatController.markRead);
router.get("/messages/:userId", protect, chatController.getMessages);
router.post("/send", protect, chatController.sendMessage);
router.post("/upload", protect, upload.single("file"), chatController.uploadAttachment);

module.exports = router;
