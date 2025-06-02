const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
