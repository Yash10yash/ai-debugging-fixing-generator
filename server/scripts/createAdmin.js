import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-debugging');
    console.log('✅ Connected to MongoDB');

    const email = process.argv[2];
    if (!email) {
      console.error('❌ Please provide an email address');
      console.log('Usage: node createAdmin.js <email>');
      process.exit(1);
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    // Update to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ User ${email} is now an admin`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();

