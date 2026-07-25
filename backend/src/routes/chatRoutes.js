const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatController");

router.get("/messages/:userId", protect, chatController.getMessages);
router.post("/send", protect, chatController.sendMessage);

module.exports = router;
