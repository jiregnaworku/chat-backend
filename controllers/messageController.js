const Message = require("../models/message");

exports.sendMessage = async (req, res) => {
  try {
    const { text, receiver } = req.body;

    if (!text || !receiver) {
      return res.status(400).json({ error: "Text and receiver are required" });
    }

    const message = await Message.create({
      sender: req.user.id, // Make sure this is populated via auth middleware
      receiver, // Add this line to reciever the message
      text,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Send Message Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
