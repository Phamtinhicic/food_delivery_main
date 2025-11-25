/**
 * Jest global setup and teardown
 */
import mongoose from 'mongoose';

// Close MongoDB connection after all tests in a file
afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
});
