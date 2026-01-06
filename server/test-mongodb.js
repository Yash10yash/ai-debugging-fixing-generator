import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function testMongoDB() {
  console.log('🧪 Testing MongoDB Connection...\n');

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
  }

  console.log('📝 Connection String:', mongoUri.replace(/:[^:@]+@/, ':****@'));
  console.log('⏳ Connecting...\n');

  try {
    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.length);
    
    await mongoose.disconnect();
    console.log('\n✅ Connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.error('\n💡 Check your username and password in the connection string');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 Check your network connection and MongoDB Atlas cluster status');
    } else if (error.message.includes('IP')) {
      console.error('\n💡 Add your IP address to MongoDB Atlas whitelist');
      console.error('   Go to: MongoDB Atlas > Network Access > Add IP Address');
    }
    
    process.exit(1);
  }
}

testMongoDB();

