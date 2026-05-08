const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expert_booking';

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log('✓ MongoDB connected');
    return true;
  } catch (error) {
    console.warn('⚠ MongoDB unavailable - running in demo mode with in-memory data');
    global.demoMode = true;
    return false;
  }
};

module.exports = connectDB;
