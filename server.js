const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");

const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:52236', 'http://localhost:3000', 'https://chat-app-85hp.web.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const io = new Server(server, {
  cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", profileRoutes);

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
