# AI Bug Explainer & Fix Generator for Junior Developers

A production-ready full-stack web application that helps junior developers understand and fix errors using AI-powered explanations in multiple languages.

## Features

- 🤖 **AI-Powered Error Analysis** - Uses Google Gemini API to explain errors in simple Hinglish
- 📊 **Skill Score Tracking** - Tracks your debugging skills (0-100)
- 🎯 **Root Cause Analysis** - Identifies multiple possible causes with probability percentages
- ✅ **Fix Generator** - Generates clean, best-practice fixes
- 🧪 **Test Fix Simulation** - Safely test if fixes would work
- 📈 **Learning History** - Track all your analyzed errors
- 👨‍💼 **Admin Dashboard** - Analytics and user management
- 🔐 **JWT Authentication** - Secure user authentication

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Rate Limiting
- Input Validation (Zod)

### AI
- Google Gemini API

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Google Gemini API Key
- Cloudinary Account (optional, for future file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-debugging-fix-website
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**

   Create `server/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-debugging
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   GEMINI_API_KEY=your-gemini-api-key-here
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend dev server on `http://localhost:3000`

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── context/       # React context
│   └── package.json
├── server/                 # Express backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   └── package.json
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Error Analysis
- `POST /api/error/analyze` - Analyze error (requires auth)
- `POST /api/error/test-fix` - Test a fix (requires auth)
- `GET /api/error/history` - Get error history (requires auth)
- `GET /api/error/:id` - Get specific error log (requires auth)

### User
- `GET /api/user/profile` - Get user profile (requires auth)
- `GET /api/user/skill-score` - Get skill score (requires auth)

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats (requires admin)
- `GET /api/admin/users` - Get all users (requires admin)
- `GET /api/admin/errors` - Get all errors (requires admin)

## Usage

1. **Sign Up / Login** - Create an account or login
2. **Paste Error** - Paste your error message, stack trace, or code snippet
3. **Get Analysis** - Receive AI-powered explanation in Hinglish
4. **Review Fix** - See the generated fix with step-by-step instructions
5. **Test Fix** - Use the "Test Fix" button to validate the solution
6. **Track Progress** - Monitor your skill score improvement over time

## Security Features

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation using Zod
- Password hashing with bcrypt
- Protected routes
- Admin role-based access control

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

