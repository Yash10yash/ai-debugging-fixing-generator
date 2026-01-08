# Quick Frontend Deployment

## Your Backend URL
```
https://ai-debugging-fixing-generator.onrender.com
```

## Fastest Way: Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import: `Yash10yash/ai-debugging-fixing-generator`
4. Settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Environment Variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://ai-debugging-fixing-generator.onrender.com/api`
6. Click "Deploy" ✅

Done! Your frontend will be live in ~2 minutes.

---

## Alternative: Netlify

1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → Import from GitHub
3. Settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Add env var: `VITE_API_BASE_URL` = `https://ai-debugging-fixing-generator.onrender.com/api`
5. Deploy ✅

---

## After Deployment

1. **Update Backend CORS** (if needed):
   - Add your frontend URL to Render environment variables:
     - `FRONTEND_URL` = `https://your-frontend.vercel.app`
   - Or the backend will auto-allow `.vercel.app`, `.netlify.app`, `.render.com` domains

2. **Test**:
   - Visit your frontend URL
   - Try login/signup
   - Test error analysis

---

## Files Created for Deployment

- ✅ `vercel.json` - Vercel configuration
- ✅ `netlify.toml` - Netlify configuration  
- ✅ `client/vercel.json` - Client-specific config
- ✅ `DEPLOYMENT.md` - Detailed guide
- ✅ Updated `client/src/services/api.js` - Uses environment variable
- ✅ Updated `server/index.js` - CORS allows production domains

