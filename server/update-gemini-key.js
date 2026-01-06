import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newApiKey = 'AIzaSyDx6agH9GBxgaKjnCVvLS29HaaerpKPAk4';
const envPath = path.join(__dirname, '.env');

try {
  // Read current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace GEMINI_API_KEY line
  if (envContent.includes('GEMINI_API_KEY=')) {
    envContent = envContent.replace(
      /GEMINI_API_KEY=.*/,
      `GEMINI_API_KEY=${newApiKey}`
    );
  } else {
    // Add it if it doesn't exist
    envContent += `\nGEMINI_API_KEY=${newApiKey}\n`;
  }
  
  // Write back
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ GEMINI_API_KEY updated successfully!');
  console.log('🔑 New API Key (first 10 chars):', newApiKey.substring(0, 10) + '...');
} catch (error) {
  console.error('❌ Error updating GEMINI_API_KEY:', error.message);
  process.exit(1);
}

