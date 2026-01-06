import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = `PORT=5000
MONGODB_URI=mongodb+srv://yg745192_db_user:yash123@cluster0.ivq1ahe.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters-long
GEMINI_API_KEY=AIzaSyCRymC7w5PcMC-SXV1q7bjeFIjPIi2Y_co
CLOUDINARY_CLOUD_NAME=dl5jiqxb1
CLOUDINARY_API_KEY=643669442585568
CLOUDINARY_API_SECRET=Khh3l9vAzvqfJ-_XQ1fxL7s9ysA
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

try {
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Backing up to .env.backup');
    fs.copyFileSync(envPath, path.join(__dirname, '.env.backup'));
  }

  // Write new .env file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update JWT_SECRET with a secure random string (min 32 characters)');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}

