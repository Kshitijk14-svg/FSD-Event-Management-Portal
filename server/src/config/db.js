import mongoose from 'mongoose';
import env from './env.js';

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 3000;

/**
 * Establishes Mongoose database connection with connection pooling,
 * retry on failure, and success/error logs.
 *
 * @param {string} [customUri] - Optional connection URI string
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDB(customUri) {
  const uri = customUri || env.MONGO_URI;

  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  mongoose.connection.on('connected', () => {
    console.log(`[MongoDB] Connected to database: ${mongoose.connection.name} at ${mongoose.connection.host}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`[MongoDB] Runtime connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Connection disconnected.');
  });

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      attempt++;
      console.log(`[MongoDB] Connecting to database (Attempt ${attempt}/${MAX_RETRIES})...`);
      const conn = await mongoose.connect(uri, options);
      return conn;
    } catch (error) {
      console.error(`[MongoDB] Connection attempt ${attempt} failed: ${error.message}`);
      if (attempt >= MAX_RETRIES) {
        console.error(`[MongoDB] Reached maximum retry limit (${MAX_RETRIES}). Failed to connect.`);
        throw error;
      }
      console.log(`[MongoDB] Retrying in ${RETRY_INTERVAL_MS / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
    }
  }
}

export default connectDB;
