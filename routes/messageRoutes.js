const express = require("express");
const Message = require("../models/message");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

// Send message
router.post("/", verifyToken, async (req, res) => {
  const { receiver, text } = req.body;

  try {
    const message = await Message.create({
      sender: req.user.id,
      receiver,
      text,
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages between two users
router.get("/:userId", verifyToken, async (req, res) => {
  const otherUserId = req.params.userId;
  const currentUserId = req.user.id;

  console.log("currentUserId:", currentUserId);
  console.log("otherUserId:", otherUserId);

  try {
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username")
      .populate("receiver", "username");

    console.log("Fetched messages:", messages);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
