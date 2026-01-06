import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a secure random JWT secret (64 characters)
const jwtSecret = crypto.randomBytes(32).toString('hex');

const envPath = path.join(__dirname, '.env');

try {
  // Read current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace JWT_SECRET line
  envContent = envContent.replace(
    /JWT_SECRET=.*/,
    `JWT_SECRET=${jwtSecret}`
  );
  
  // Write back
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ JWT_SECRET generated and updated in .env file');
  console.log('🔐 Your JWT_SECRET:', jwtSecret);
} catch (error) {
  console.error('❌ Error updating JWT_SECRET:', error.message);
  process.exit(1);
}

