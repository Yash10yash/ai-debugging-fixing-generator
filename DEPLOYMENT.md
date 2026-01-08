# Frontend Deployment Guide

Your backend is live at: `https://ai-debugging-fixing-generator.onrender.com`

## Option 1: Deploy to Vercel (Recommended - Easiest)

### Steps:

1. **Install Vercel CLI** (optional, or use web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Web Interface** (Recommended):
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your repository: `Yash10yash/ai-debugging-fixing-generator`
   - Configure the project:
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
   - Add Environment Variable:
     - **Name**: `VITE_API_BASE_URL`
     - **Value**: `https://ai-debugging-fixing-generator.onrender.com/api`
   - Click "Deploy"

3. **Deploy via CLI**:
   ```bash
   cd client
   vercel
   # Follow prompts, set VITE_API_BASE_URL when asked
   ```

### After Deployment:
- Vercel will give you a URL like: `https://your-app.vercel.app`
- Your frontend will automatically connect to your Render backend

---

## Option 2: Deploy to Netlify

### Steps:

1. **Go to [netlify.com](https://netlify.com)**
   - Sign up/Login with GitHub

2. **Add New Site**:
   - Click "Add new site" → "Import an existing project"
   - Connect to your GitHub repository
   - Configure build settings:
     - **Base directory**: `client`
     - **Build command**: `npm run build`
     - **Publish directory**: `client/dist`

3. **Add Environment Variable**:
   - Go to Site settings → Environment variables
   - Add:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://ai-debugging-fixing-generator.onrender.com/api`

4. **Deploy**:
   - Click "Deploy site"

---

## Option 3: Deploy to Render (Same as Backend)

### Steps:

1. **Go to [render.com](https://render.com)**
   - Sign up/Login

2. **Create New Static Site**:
   - Click "New" → "Static Site"
   - Connect your GitHub repository

3. **Configure**:
   - **Name**: `ai-debugging-frontend` (or any name)
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variable**:
   - In the Environment section, add:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://ai-debugging-fixing-generator.onrender.com/api`

5. **Deploy**:
   - Click "Create Static Site"

---

## Important Notes:

1. **CORS Configuration**: Make sure your backend (Render) has CORS enabled for your frontend domain. Check `server/index.js` for CORS settings.

2. **Environment Variables**: The frontend uses `VITE_API_BASE_URL` to connect to the backend. In production, this should be your Render backend URL.

3. **Backend URL Format**: 
   - Development: Uses proxy (`/api`)
   - Production: Full URL (`https://ai-debugging-fixing-generator.onrender.com/api`)

4. **Testing**: After deployment, test:
   - Login/Signup
   - Error analysis
   - Quiz feature
   - All API calls

---

## Quick Deploy Commands (Vercel CLI):

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client folder
cd client

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_BASE_URL
# Enter: https://ai-debugging-fixing-generator.onrender.com/api

# Deploy to production
vercel --prod
```

---

## Troubleshooting:

1. **CORS Errors**: 
   - Update `server/index.js` to include your frontend URL in CORS origins
   - Example: `origin: ['https://your-frontend.vercel.app']`

2. **API Not Connecting**:
   - Verify `VITE_API_BASE_URL` is set correctly
   - Check browser console for errors
   - Ensure backend is running on Render

3. **Build Fails**:
   - Check Node version (should be 18+)
   - Verify all dependencies are in `package.json`
   - Check build logs in deployment platform

---

## Recommended: Vercel

Vercel is the easiest and fastest option for React/Vite apps:
- Automatic deployments on git push
- Free SSL certificate
- Fast CDN
- Easy environment variable management
- Great performance

