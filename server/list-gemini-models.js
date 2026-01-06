import dotenv from 'dotenv';

dotenv.config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
  }

  console.log('📋 Fetching available Gemini models...\n');

  // Try v1 endpoint
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.models) {
      console.log('✅ Available models (v1):');
      data.models.forEach(model => {
        console.log(`  - ${model.name}`);
        if (model.supportedGenerationMethods?.includes('generateContent')) {
          console.log(`    ✓ Supports generateContent`);
        }
      });
      
      // Find models that support generateContent
      const usableModels = data.models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (usableModels.length > 0) {
        console.log('\n✅ Usable models for generateContent:');
        usableModels.forEach(model => {
          const modelId = model.name.replace('models/', '');
          console.log(`  - ${modelId}`);
        });
        
        // Try the first usable model
        if (usableModels[0]) {
          const testModel = usableModels[0].name.replace('models/', '');
          console.log(`\n🧪 Testing with model: ${testModel}...`);
          
          const testUrl = `https://generativelanguage.googleapis.com/v1/models/${testModel}:generateContent?key=${apiKey}`;
          const testResponse = await fetch(testUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: 'Say hello' }]
              }]
            })
          });
          
          const testData = await testResponse.json();
          if (testResponse.ok) {
            console.log(`✅ ${testModel} works!`);
            console.log('Response:', testData.candidates[0].content.parts[0].text);
            console.log(`\n💡 Use this model name in your code: "${testModel}"`);
          } else {
            console.log(`❌ ${testModel} failed:`, testData);
          }
        }
      }
    } else {
      console.log('❌ Failed to list models:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels();

