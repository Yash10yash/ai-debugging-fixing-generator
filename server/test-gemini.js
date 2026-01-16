import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testGemini() {
  console.log('🧪 Testing Gemini API...\n');

  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    process.exit(1);
  }

  console.log('✅ GEMINI_API_KEY found');
  console.log('🔑 API Key (first 10 chars):', process.env.GEMINI_API_KEY.substring(0, 10) + '...\n');

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // List available models first
    console.log('📋 Fetching available models...');
    try {
      const models = await genAI.listModels();
      console.log('Available models:', models.map(m => m.name).join(', '));
    } catch (e) {
      console.log('Could not list models:', e.message);
    }
    
    // Try different model names (common ones)
    const models = [
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-flash-001',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash-latest'
    ];
    
    let workingModel = null;
    for (const modelName of models) {
      try {
        console.log(`\nTesting model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent('Say "Hello" in one word');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} works! Response: ${text}`);
        workingModel = modelName;
        break; // Use the first working model
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message}`);
      }
    }
    
    if (!workingModel) {
      console.error('\n❌ No working model found. Please check your API key and available models.');
      process.exit(1);
    }

    // Test with a simple error
    console.log(`\n🧪 Testing error analysis with ${workingModel}...`);
    const model = genAI.getGenerativeModel({ model: workingModel });
    const prompt = `Analyze this error in JSON format:
{
  "error_explanation": "Simple explanation",
  "root_cause": "Root cause",
  "possible_causes": [{"cause": "Test", "probability": 100}],
  "fix": {"code": "console.log('test')", "steps": ["Step 1"]},
  "why_fix_works": "Because",
  "visual_flow": "Flow",
  "real_world_example": "Example",
  "learning_tip": "Tip",
  "difficulty": "easy",
  "skill_score_delta": 5
}

Error: TypeError: Cannot read property 'map' of undefined`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Error analysis test response received');
    console.log('Response length:', text.length);
    console.log('First 200 chars:', text.substring(0, 200));
    
  } catch (error) {
    console.error('❌ Gemini API test failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testGemini();

