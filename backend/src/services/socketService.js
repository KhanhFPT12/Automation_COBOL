const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");

// Track which user email each socket belongs to
const socketUsers = new Map();
let socketServer = null;

function setupSocket(io) {
  socketServer = io;
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    let myEmail = null;
    let myRole = null;

    socket.on("join", async ({ userId }) => {
      myEmail = userId;
      socketUsers.set(socket.id, { email: userId });
      socket.join("user:" + userId);
      try {
        const user = await User.findOne({ $or: [{ email: userId }, { businessEmail: userId }] }).select("role").lean();
        if (user) socket.join("user:" + user._id.toString());
        if (user && user.role === "ADMIN") {
          myRole = "ADMIN";
          socket.join("admins");
        } else {
          myRole = "USER";
        }
        console.log("User", userId, "joined as", myRole);
      } catch (e) { console.error("join error:", e.message); }
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderEmail, senderRole, senderName, message } = data;
        if (!message || !message.trim()) return;

        // userEmail = the END USER involved (not admin). Admin sees all chats grouped by userEmail.
        const userEmail = senderRole === "USER" ? senderEmail : data.toUserEmail;

        const chatMsg = await ChatMessage.create({
          userEmail,
          senderEmail,
          senderRole,
          senderName,
          message: message.trim()
        });
        const msgObj = chatMsg.toObject();

        // Send to admins room AND the specific user room
        io.to("admins").emit("new_message", msgObj);
        io.to("user:" + userEmail).emit("new_message", msgObj);
      } catch (err) { console.error("send_message error:", err.message); }
    });

    socket.on("disconnect", () => {
      socketUsers.delete(socket.id);
      console.log("Socket disconnected:", socket.id);
    });
  });
}

function emitNotification(userId, notification) {
  if (!socketServer) return;
  socketServer.to("user:" + userId.toString()).emit("notification:new", notification);
}

module.exports = setupSocket;
module.exports.emitNotification = emitNotification;
