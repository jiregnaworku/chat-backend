const Message = require("../models/message");

exports.sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user,
      text: req.body.text,
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("sender", "username");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
