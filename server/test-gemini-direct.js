import dotenv from 'dotenv';

dotenv.config();

async function testGeminiDirect() {
  console.log('🧪 Testing Gemini API with direct REST call...\n');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
  }

  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...\n');

  // Try v1 endpoint first
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: 'Say hello in one word'
      }]
    }]
  };

  try {
    console.log('Testing v1 endpoint...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ v1 endpoint works!');
      console.log('Response:', JSON.stringify(data, null, 2).substring(0, 200));
    } else {
      console.log('❌ v1 endpoint failed:', response.status, data);
      
      // Try v1beta
      console.log('\nTesting v1beta endpoint...');
      const urlBeta = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      const responseBeta = await fetch(urlBeta, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const dataBeta = await responseBeta.json();
      if (responseBeta.ok) {
        console.log('✅ v1beta endpoint works!');
        console.log('Response:', JSON.stringify(dataBeta, null, 2).substring(0, 200));
      } else {
        console.log('❌ v1beta endpoint failed:', responseBeta.status, dataBeta);
        console.log('\n💡 The API key might not have access to Gemini models.');
        console.log('💡 Or the models might have different names.');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGeminiDirect();

