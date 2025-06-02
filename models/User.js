const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: [true, 'Username is required'], 
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    profileImage: { 
      type: String, 
      default: null 
    },
    lastSeen: { 
      type: Date, 
      default: Date.now 
    },
    status: { 
      type: String, 
      default: 'Hey there! I am using ChatApp',
      trim: true
    },
  },
  { 
    timestamps: true,
    versionKey: false // Disable the version key
  }
);

// Add index for faster queries
userSchema.index({ username: 1, email: 1 });

module.exports = mongoose.model("User", userSchema);
