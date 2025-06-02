const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: "All fields (username, email, password) are required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters long" 
      });
    }

    // Check if username or email exists
    const existingUser = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });
    
    if (existingUser) {
      if (existingUser.username.toLowerCase() === username.toLowerCase()) {
        return res.status(400).json({ error: "Username already exists" });
      }
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: user._id,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(err.errors).map(val => val.message).join(', ')
      });
    }
    res.status(500).json({ error: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login attempt with body:', req.body);
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ 
        error: "Both username/email and password are required" 
      });
    }

    console.log('Searching for user with username/email:', username.toLowerCase());
    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    });

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log('User found, checking password');
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log('Password matched, updating last seen');
    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    console.log('Creating JWT token');
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log('Login successful for user:', user.username);
    res.json({
      token,
      userId: user._id,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    console.error('Login error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    // Check for specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: Object.values(err.errors).map(val => val.message).join(', ')
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(500).json({ error: "Error generating authentication token" });
    }
    if (err.name === 'MongoError') {
      return res.status(500).json({ error: "Database error during login" });
    }
    
    res.status(500).json({ 
      error: "Server error during login",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
