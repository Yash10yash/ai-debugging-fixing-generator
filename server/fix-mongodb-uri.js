import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');

try {
  // Read current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Fix MongoDB URI - add database name if missing
  const mongoUriMatch = envContent.match(/MONGODB_URI=(.+)/);
  if (mongoUriMatch) {
    let mongoUri = mongoUriMatch[1].trim();
    
    // Check if database name is missing (URI ends with /? or just ?)
    if (mongoUri.includes('?') && !mongoUri.match(/\/[^\/\?]+\?/)) {
      // Add database name before the query string, remove any double slashes
      mongoUri = mongoUri.replace(/\/+\?/, '/ai-debugging?').replace(/\/+/g, '/');
    } else if (!mongoUri.match(/\/[^\/\?]+(\?|$)/)) {
      // Add database name if missing, clean up slashes
      mongoUri = mongoUri.replace(/\/+$/, '') + '/ai-debugging';
    }
    
    // Clean up any double slashes (but keep // after mongodb+srv://)
    mongoUri = mongoUri.replace(/([^:])\/+/g, '$1/');
    
    // Update the .env file
    envContent = envContent.replace(
      /MONGODB_URI=.*/,
      `MONGODB_URI=${mongoUri}`
    );
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ MongoDB URI fixed!');
    console.log('📝 Updated URI:', mongoUri.replace(/:[^:@]+@/, ':****@'));
  } else {
    console.log('⚠️  MONGODB_URI not found in .env file');
  }
} catch (error) {
  console.error('❌ Error fixing MongoDB URI:', error.message);
  process.exit(1);
}

