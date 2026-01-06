import dotenv from 'dotenv';
import { analyzeError } from './services/geminiService.js';

dotenv.config();

async function testErrorAnalysis() {
  console.log('🧪 Testing Full Error Analysis Flow...\n');

  const testError = `TypeError: Cannot read property 'map' of undefined
    at processData (app.js:15:23)
    at main (app.js:8:5)`;

  try {
    console.log('📝 Test Error:');
    console.log(testError);
    console.log('\n⏳ Analyzing with Gemini AI...\n');

    const result = await analyzeError(testError, 'error_message');

    console.log('✅ Analysis Complete!\n');
    console.log('📊 Results:');
    console.log('─'.repeat(50));
    console.log('Error Explanation:', result.error_explanation?.substring(0, 100) + '...');
    console.log('Root Cause:', result.root_cause?.substring(0, 100) + '...');
    console.log('Difficulty:', result.difficulty);
    console.log('Skill Score Delta:', result.skill_score_delta);
    console.log('Possible Causes:', result.possible_causes?.length || 0);
    console.log('Fix Code Length:', result.fix?.code?.length || 0);
    console.log('─'.repeat(50));

    if (result.error_explanation && result.fix) {
      console.log('\n✅ SUCCESS! Error analysis is working correctly!');
      console.log('🚀 Your application is ready to use!');
    } else {
      console.log('\n⚠️  Analysis incomplete - some fields missing');
    }
  } catch (error) {
    console.error('\n❌ Error Analysis Failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testErrorAnalysis();

