import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

dotenv.config();

async function diagnoseNetwork() {
  console.log('🔍 Network Diagnostics\n');
  console.log('='.repeat(50));

  // 1. Check MongoDB Connection
  console.log('\n1️⃣  Testing MongoDB Connection...');
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found');
  } else {
    try {
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB: Connected');
      console.log('   Database:', mongoose.connection.db.databaseName);
      await mongoose.disconnect();
    } catch (error) {
      console.error('❌ MongoDB: Connection failed');
      console.error('   Error:', error.message);
      
      if (error.message.includes('authentication')) {
        console.error('   💡 Check username/password in connection string');
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.error('   💡 Network issue - check internet connection');
      } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
        console.error('   💡 IP not whitelisted in MongoDB Atlas');
        console.error('   💡 Go to: MongoDB Atlas > Network Access > Add IP Address');
        console.error('   💡 Or add: 0.0.0.0/0 (allow all IPs - for development only)');
      }
    }
  }

  // 2. Check Backend Server
  console.log('\n2️⃣  Testing Backend Server...');
  try {
    const response = await fetch('http://localhost:5000/api/health');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend Server: Running');
      console.log('   Status:', data.status);
    } else {
      console.error('❌ Backend Server: Not responding correctly');
      console.error('   Status:', response.status);
    }
  } catch (error) {
    console.error('❌ Backend Server: Not reachable');
    console.error('   Error:', error.message);
    console.error('   💡 Make sure server is running: npm run dev');
  }

  // 3. Check Gemini API
  console.log('\n3️⃣  Testing Gemini API...');
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.error('❌ GEMINI_API_KEY not found');
  } else {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'test' }] }]
        })
      });
      
      if (response.ok) {
        console.log('✅ Gemini API: Working');
      } else {
        const data = await response.json();
        console.error('❌ Gemini API: Error');
        console.error('   Status:', response.status);
        console.error('   Error:', data.error?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Gemini API: Network error');
      console.error('   Error:', error.message);
      console.error('   💡 Check internet connection');
    }
  }

  // 4. Check Ports
  console.log('\n4️⃣  Checking Ports...');
  const net = await import('net');
  const checkPort = (port) => {
    return new Promise((resolve) => {
      const server = net.default.createServer();
      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });
      server.on('error', () => resolve(false));
    });
  };

  const port5000 = await checkPort(5000);
  const port5173 = await checkPort(5173);

  console.log(port5000 ? '✅ Port 5000: Available' : '❌ Port 5000: In use');
  console.log(port5173 ? '✅ Port 5173: Available' : '❌ Port 5173: In use');

  if (!port5000) {
    console.error('   💡 Another process is using port 5000');
    console.error('   💡 Kill it or change PORT in .env');
  }
  if (!port5173) {
    console.error('   💡 Another process is using port 5173');
    console.error('   💡 Kill it or change port in vite.config.js');
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Diagnostics complete!');
}

diagnoseNetwork().catch(console.error);

