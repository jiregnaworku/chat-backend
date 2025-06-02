const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: null },
    lastSeen: { type: Date, default: Date.now },
    status: { type: String, default: 'Hey there! I am using ChatApp' },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
