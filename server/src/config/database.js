const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pulsewatch';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Warning: MongoDB connection failed (${error.message}).`);
    console.warn(`[Database] Application running with mock memory database or retrying...`);
    return null;
  }
};

module.exports = connectDB;
