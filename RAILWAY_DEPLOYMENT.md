# Deploy to Railway - Step by Step Guide

This guide will walk you through deploying your Dental Product Pricing System to Railway.

## What is Railway?

Railway is a modern cloud platform that makes it easy to deploy web applications. It provides:
- Free PostgreSQL database
- Automatic deployments from GitHub
- Simple environment variable management
- Free tier to get started

## Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Git installed on your computer

## Step 1: Prepare Your Project for Railway

### 1.1 Initialize Git Repository

```bash
cd "/Users/mousbah/Documents/programming/msdc/product pricing"
git init
git add .
git commit -m "Initial commit: Dental Product Pricing System"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., "dental-pricing-system")
3. **Don't** initialize with README (we already have one)
4. Copy the repository URL

### 1.3 Push to GitHub

```bash
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account

1. Go to https://railway.app
2. Click "Login" and sign in with GitHub
3. Authorize Railway to access your GitHub account

### 2.2 Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your "dental-pricing-system" repository
4. Railway will detect your project

### 2.3 Add PostgreSQL Database

1. In your Railway project dashboard, click "New"
2. Select "Database"
3. Choose "PostgreSQL"
4. Railway will create and provision your database

### 2.4 Configure Backend Service

1. Click on your backend service (the one from GitHub)
2. Go to "Settings" tab
3. Set the **Root Directory** to: `backend`
4. Set **Build Command** to: `npm install && npm run db:generate && npm run build`
5. Set **Start Command** to: `npm start`

### 2.5 Add Environment Variables

1. Click on your backend service
2. Go to "Variables" tab
3. Click "New Variable"
4. Add the following variables:

   **DATABASE_URL**
   - Click on your PostgreSQL service
   - Copy the "DATABASE_URL" connection string
   - Paste it as the value

   **PORT**
   - Leave blank (Railway sets this automatically)

   **NODE_ENV**
   - Value: `production`

5. Click "Deploy" to apply changes

### 2.6 Run Database Migration

1. After deployment, go to your backend service
2. Click on "Deployments" tab
3. Click on the latest deployment
4. You should see "Build succeeded" and "Deployed"
5. The Prisma migration runs automatically during build

### 2.7 Get Your Backend URL

1. Click on your backend service
2. Go to "Settings" tab
3. Under "Networking", click "Generate Domain"
4. Copy the URL (e.g., `https://your-app.up.railway.app`)
5. **Save this URL** - you'll need it for the frontend

## Step 3: Deploy Frontend to Railway

### 3.1 Update Frontend API Configuration

Before deploying frontend, update the API URL:

**Option A: Using Railway for Frontend**

1. In your Railway project, click "New"
2. Select "GitHub Repo"
3. Choose the same repository
4. Click "Add Service"

### 3.2 Configure Frontend Service

1. Click on the new service
2. Go to "Settings" tab
3. Set **Root Directory** to: `frontend`
4. Set **Build Command** to: `npm install && npm run build`
5. Set **Start Command** to: `npx vite preview --host 0.0.0.0 --port $PORT`

### 3.3 Add Frontend Environment Variable

1. Go to "Variables" tab
2. Add a new variable:

   **VITE_API_URL**
   - Value: Your backend URL from Step 2.7 (e.g., `https://your-backend.up.railway.app`)

### 3.4 Update Frontend Code

Update the API configuration to use environment variable:

Edit `frontend/src/lib/api.ts` and change the baseURL:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Commit and push this change:

```bash
git add frontend/src/lib/api.ts
git commit -m "Update API URL for production"
git push
```

Railway will automatically redeploy.

### 3.5 Generate Frontend Domain

1. Click on your frontend service
2. Go to "Settings" tab
3. Under "Networking", click "Generate Domain"
4. Copy the URL (e.g., `https://your-frontend.up.railway.app`)

## Step 4: Alternative - Deploy Frontend to Vercel (Recommended)

Vercel is better optimized for React apps and has a generous free tier.

### 4.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub

### 4.2 Import Project

1. Click "Add New Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.3 Add Environment Variable

1. Under "Environment Variables":
   - **Name**: `VITE_API_URL`
   - **Value**: Your Railway backend URL
2. Click "Deploy"

### 4.4 Update Backend CORS

Update `backend/src/index.ts` to allow your frontend domain:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app',
    'https://your-frontend.up.railway.app'
  ],
  credentials: true
}));
```

Commit and push:

```bash
git add backend/src/index.ts
git commit -m "Update CORS for production domain"
git push
```

## Step 5: Verify Deployment

### 5.1 Test Backend

Visit your backend URL + `/health`:
```
https://your-backend.up.railway.app/health
```

You should see:
```json
{"status":"ok","timestamp":"2025-01-13T..."}
```

### 5.2 Test Frontend

1. Visit your frontend URL
2. Try to:
   - View the dashboard
   - Add a company
   - Add a product
   - Record a purchase
   - View price comparison

## Step 6: Set Up Automatic Deployments

Railway and Vercel automatically deploy when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Your change description"
git push

# Railway and Vercel will automatically deploy!
```

## Monitoring and Management

### Railway Database Management

1. **View Database**:
   - Click on PostgreSQL service
   - Go to "Data" tab
   - You can query your database directly

2. **Backups**:
   - Railway automatically backs up your database
   - Go to PostgreSQL service → "Backups" tab

3. **Connection String**:
   - PostgreSQL service → "Connect" tab
   - Copy connection string to use with tools like pgAdmin

### Check Logs

1. Click on any service (backend/frontend)
2. Go to "Deployments" tab
3. Click on a deployment
4. View logs to debug issues

## Environment Variables Summary

### Backend (.env on Railway)
```
DATABASE_URL=postgresql://... (automatically set by Railway)
NODE_ENV=production
PORT=(automatically set by Railway)
```

### Frontend (Vercel or Railway)
```
VITE_API_URL=https://your-backend.up.railway.app
```

## Cost Estimate

### Railway Free Tier
- $5 credit per month
- PostgreSQL: ~$5/month (uses your credit)
- Backend hosting: Included in credit
- **Total: FREE** (within $5 credit)

### Vercel Free Tier (if used)
- Unlimited bandwidth
- 100GB storage
- **Total: FREE**

**Combined: Completely FREE for small to medium usage!**

## Troubleshooting

### Backend Issues

**"Database connection failed"**
- Check DATABASE_URL in Railway variables
- Ensure PostgreSQL service is running
- Check backend deployment logs

**"Build failed"**
- Check that Root Directory is set to `backend`
- Verify package.json exists in backend folder
- Check deployment logs for specific errors

### Frontend Issues

**"Cannot connect to API"**
- Verify VITE_API_URL is set correctly
- Check backend is running (visit /health endpoint)
- Check CORS settings in backend

**"404 on refresh"**
- Add a `vercel.json` file in frontend folder:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Database Migration Issues

**"Table does not exist"**
```bash
# Connect to your Railway database using provided connection string
# Run migration manually:
cd backend
DATABASE_URL="your_railway_database_url" npm run db:push
```

## Security Best Practices

1. **Never commit .env files** (already in .gitignore)
2. **Use Railway's variables** for secrets
3. **Enable CORS** only for your frontend domain
4. **Regular backups**: Railway does this automatically
5. **Monitor logs**: Check regularly for errors

## Updating Your Application

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Railway and Vercel automatically deploy!
# Wait 1-2 minutes for deployment to complete
```

## Custom Domain (Optional)

### Add Custom Domain to Railway
1. Go to service → Settings → Networking
2. Click "Custom Domain"
3. Add your domain (e.g., pricing.yourdental.com)
4. Update DNS records as shown

### Add Custom Domain to Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as shown

## Support and Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Railway Discord: https://discord.gg/railway
- Your project README.md for development info

## Quick Reference Commands

```bash
# View your Railway projects
railway list

# Link to Railway project
railway link

# View logs
railway logs

# Open Railway dashboard
railway open

# Push changes
git add .
git commit -m "Update message"
git push
```

---

Your Dental Product Pricing System is now live and accessible from anywhere in the world!
