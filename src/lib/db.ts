// lib/db.ts
import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGODB_URI!;

if (!MONGO_URL) {
  throw new Error('Defina a variável de ambiente MONGODB_URI');
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(MONGO_URL);
  isConnected = true;
};
