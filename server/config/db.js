import mongoose from 'mongoose';
import env from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    
    const uri = env.MONGODB_URI;
    const dbName = uri.split('/').pop().split('?')[0] || 'unknown';
    const isAtlas = uri.includes('mongodb+srv') || uri.includes('atlas');
    const hostType = isAtlas ? 'MongoDB Atlas' : 'MongoDB Local';
    const host = isAtlas ? conn.connection.host.split('.')[0] + ' (Atlas)' : conn.connection.host;

    console.log(`\x1b[32m✅ MongoDB Connected\x1b[0m`);
    console.log(`\x1b[36m   Host: ${hostType}\x1b[0m`);
    console.log(`\x1b[36m   Server: ${conn.connection.host}\x1b[0m`);
    console.log(`\x1b[36m   Database: ${dbName}\x1b[0m`);
    console.log(`\x1b[36m   Port: ${conn.connection.port}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m❌ MongoDB connection failed: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

export default connectDB;