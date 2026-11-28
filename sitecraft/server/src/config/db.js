import mongoose from 'mongoose';

export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Add your MongoDB Atlas connection string to server/.env');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
}
