# Frontend Deployment Guide for Vercel

## Prerequisites
- Node.js 18+ installed
- Vercel account
- Backend deployed on Render at: https://codexa-api.onrender.com

## Environment Variables

The frontend is configured to use the production backend URL by default. If you need to override it, set the following environment variable in Vercel:

```
VITE_API_URL=https://codexa-api.onrender.com/api
```

## Deployment Steps

### 1. Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
cd codexa/frontend
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Set the root directory to `codexa/frontend`
4. Vercel will automatically detect it's a Vite project
5. Deploy!

### 3. Configure Environment Variables (if needed)
In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `VITE_API_URL` with value `https://codexa-api.onrender.com/api`

## Build Configuration

The project is configured with:
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Production Optimizations

- Code splitting for better performance
- Terser minification
- Static asset caching
- Security headers
- CORS configuration for production backend

## Troubleshooting

### CORS Issues
If you encounter CORS issues, ensure your backend (Render) has the correct CORS configuration for your Vercel domain.

### Build Failures
- Ensure all dependencies are in `package.json`
- Check for any TypeScript errors
- Verify environment variables are set correctly

### API Connection Issues
- Verify the backend URL is correct
- Check if the backend is running and accessible
- Ensure CORS is properly configured on the backend
