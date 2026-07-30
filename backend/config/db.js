import mongoose from 'mongoose';

let isInMemoryFallback = false;

export const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sms_portal';
  try {
    // Attempt MongoDB connection with 3 sec timeout for quick fallback fallback if not available
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    isInMemoryFallback = false;
    return true;
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB (${error.message}).`);
    console.warn(`[Database] Switching to high-performance In-Memory Data Store fallback mode!`);
    isInMemoryFallback = true;
    return false;
  }
};

export const getIsInMemory = () => isInMemoryFallback;
