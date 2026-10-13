import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI;

export async function connectToMongoDB() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is missing from your environment variables.');
  }

  await mongoose.connect(MONGO_URI);
  console.log('Successfully connected to MongoDB!');
}

export async function disconnectFromMongoDB() {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}