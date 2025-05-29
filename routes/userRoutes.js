const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Message = require("../models/message"); // Make sure to import Message model
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "username _id"
    );

    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId },
          ],
        })
          .sort({ createdAt: -1 })
          .select("text sender receiver createdAt");

        return {
          _id: user._id,
          username: user.username,
          lastMessage: lastMessage
            ? {
                text: lastMessage.text,
                timestamp: lastMessage.createdAt,
                fromSelf: lastMessage.sender.toString() === currentUserId,
              }
            : null,
        };
      })
    );

    res.json(usersWithLastMessage);
  } catch (err) {
    console.error("Error in /api/users:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
