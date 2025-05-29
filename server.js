const dotenv = require("dotenv");

const express = require("express");
const http = require("http");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ✅ Track online users
const onlineUsers = new Map();

// Socket.io
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // When user joins with their ID
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`👤 ${userId} is online`);
    io.emit("userOnline", { userId });
  });

  // ✅ Typing indicators
  socket.on("typing", ({ toUserId }) => {
    socket.broadcast.emit("userTyping", { userId: toUserId });
  });

  socket.on("stopTyping", ({ toUserId }) => {
    socket.broadcast.emit("userStoppedTyping", { userId: toUserId });
  });

  // ✅ Message send
  socket.on("sendMessage", (data) => {
    socket.broadcast.emit("receiveMessage", data);
  });

  // ✅ Delivery confirmation
  socket.on("delivered", ({ messageId, toUserId }) => {
    socket.broadcast.emit("messageDelivered", { messageId, userId: toUserId });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("userOffline", { userId });
        console.log(`🔴 ${userId} is offline`);
        break;
      }
    }
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
