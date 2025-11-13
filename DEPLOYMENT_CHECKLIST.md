# Railway Deployment Checklist ✓

Follow this checklist to deploy your Dental Product Pricing System to Railway.

## Pre-Deployment Checklist

- [ ] PostgreSQL installed locally (for development)
- [ ] GitHub account created
- [ ] Railway account created (https://railway.app)
- [ ] Vercel account created (https://vercel.com) - optional but recommended

## Part 1: Push to GitHub

- [ ] Open terminal in project folder
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit"`
- [ ] Create new repo on GitHub
- [ ] Copy GitHub repo URL
- [ ] Run: `git remote add origin YOUR_GITHUB_URL`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`
- [ ] Verify files are on GitHub

## Part 2: Railway Backend Setup

### Create Project
- [ ] Go to https://railway.app
- [ ] Click "Login" → Sign in with GitHub
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your dental-pricing-system repo
- [ ] Wait for initial detection

### Add Database
- [ ] Click "New" in your project
- [ ] Select "Database"
- [ ] Choose "PostgreSQL"
- [ ] Wait for database to provision (1-2 minutes)
- [ ] Database is ready when you see "Active" status

### Configure Backend Service
- [ ] Click on your backend service (GitHub repo)
- [ ] Go to "Settings" tab
- [ ] Scroll to "Service Settings"
- [ ] Set **Root Directory**: `backend`
- [ ] Scroll to "Build & Deploy"
- [ ] No need to change Build Command (auto-detected)
- [ ] No need to change Start Command (auto-detected)

### Set Environment Variables
- [ ] Click on your backend service
- [ ] Go to "Variables" tab
- [ ] Click "New Variable"
- [ ] Add: `NODE_ENV` = `production`
- [ ] **Don't add DATABASE_URL** (automatically connected)
- [ ] Click outside to save

### Get Backend URL
- [ ] Click on your backend service
- [ ] Go to "Settings" tab
- [ ] Scroll to "Networking" section
- [ ] Click "Generate Domain"
- [ ] **Copy the URL** (e.g., `https://something.up.railway.app`)
- [ ] **SAVE THIS URL** - you need it for frontend!

### Verify Backend Works
- [ ] Visit: `https://YOUR-BACKEND-URL/health`
- [ ] You should see: `{"status":"ok","timestamp":"..."}`
- [ ] If not, check "Deployments" tab for errors

## Part 3: Vercel Frontend Setup (Recommended)

### Create Project
- [ ] Go to https://vercel.com
- [ ] Click "Login" → Sign in with GitHub
- [ ] Click "Add New..." → "Project"
- [ ] Click "Import" next to your repo
- [ ] Click "Import" again

### Configure Project
- [ ] Framework Preset: **Vite** (auto-detected)
- [ ] Root Directory: Click "Edit" → Enter `frontend` → Save
- [ ] Build Command: `npm run build` (auto-filled)
- [ ] Output Directory: `dist` (auto-filled)
- [ ] Install Command: `npm install` (auto-filled)

### Add Environment Variable
- [ ] Find "Environment Variables" section
- [ ] Variable name: `VITE_API_URL`
- [ ] Value: `https://YOUR-BACKEND-URL/api` (from Part 2)
- [ ] Make sure to add `/api` at the end!
- [ ] Click "Add"

### Deploy
- [ ] Click "Deploy" button
- [ ] Wait 1-2 minutes for build
- [ ] When done, click "Visit" to see your app!

## Part 4: Test Everything

### Test Backend
- [ ] Visit: `https://YOUR-BACKEND-URL/health`
- [ ] Should return JSON with status "ok"

### Test Frontend
- [ ] Visit your Vercel URL
- [ ] Should see Dashboard page
- [ ] Click "Companies" - should load (empty)
- [ ] Click "Products" - should load (empty)

### Test Full Flow
- [ ] Click "Companies" → "Add Company"
- [ ] Fill in: Name, Email, Phone
- [ ] Click "Add Company"
- [ ] Should see company appear ✓
- [ ] Click "Products" → "Add Product"
- [ ] Fill in: Product name, Category
- [ ] Click "Add Product"
- [ ] Should see product appear ✓
- [ ] Click "Purchases" → "Add Purchase"
- [ ] Select product and company
- [ ] Enter price and quantity
- [ ] Click "Add Purchase"
- [ ] Should see purchase appear ✓
- [ ] Go to "Products" → Click "View" on your product
- [ ] Should see price comparison ✓

## Part 5: Optional - Custom Domain

### For Vercel (Frontend)
- [ ] Go to Project Settings → Domains
- [ ] Click "Add"
- [ ] Enter your domain (e.g., `pricing.yourdental.com`)
- [ ] Follow DNS setup instructions
- [ ] Wait for DNS propagation (up to 24 hours)

### For Railway (Backend)
- [ ] Go to Backend service → Settings
- [ ] Scroll to "Networking"
- [ ] Click "Custom Domain"
- [ ] Enter domain (e.g., `api.yourdental.com`)
- [ ] Update DNS records as shown
- [ ] Update `VITE_API_URL` in Vercel to new domain

## Troubleshooting

### Backend Issues

**"Service won't start"**
- [ ] Check Railway logs: Deployments → Latest deployment → View logs
- [ ] Verify Root Directory is set to `backend`
- [ ] Check DATABASE_URL is present in Variables (should be automatic)

**"Database connection failed"**
- [ ] Check PostgreSQL service is running (should be green)
- [ ] Click on PostgreSQL service → "Connect" → Verify URL format
- [ ] Redeploy backend service

### Frontend Issues

**"Cannot connect to API" or "Network Error"**
- [ ] Check VITE_API_URL in Vercel environment variables
- [ ] Make sure URL ends with `/api`
- [ ] Test backend health endpoint directly
- [ ] Check browser console for CORS errors
- [ ] Verify backend is deployed and running

**"Page not found on refresh"**
- [ ] Verify `vercel.json` is in the root directory
- [ ] Redeploy frontend

### Database Issues

**"No tables exist"**
- [ ] Check backend build logs for Prisma migration
- [ ] Should see "Prisma schema loaded" in logs
- [ ] If not, check `backend/package.json` has `postinstall` script

## Costs & Limits

### Railway Free Tier
- [ ] $5 free credit per month
- [ ] ~500 hours of runtime
- [ ] PostgreSQL included
- [ ] Enough for small clinic usage

### Vercel Free Tier
- [ ] 100GB bandwidth/month
- [ ] Unlimited websites
- [ ] Free SSL certificates
- [ ] More than enough for most uses

## Monitoring

### Check Railway Usage
- [ ] Railway Dashboard → Account Settings → Usage
- [ ] Monitor credit remaining
- [ ] Check runtime hours

### View Logs
- [ ] Railway: Service → Deployments → Click deployment → View logs
- [ ] Vercel: Project → Deployments → Click deployment → Runtime Logs

## Updates & Maintenance

### Deploy Updates
```bash
# Make changes to code
git add .
git commit -m "Description of changes"
git push

# Railway and Vercel auto-deploy!
```

### Monitor Deployments
- [ ] Railway: Check "Deployments" tab for status
- [ ] Vercel: Check "Deployments" page for status
- [ ] Both should auto-deploy on git push

## Success! 🎉

Your Dental Product Pricing System is now live and accessible from anywhere!

**Important URLs to Save:**
- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.railway.app
- Backend Health: https://your-backend.railway.app/health
- Railway Dashboard: https://railway.app/dashboard
- Vercel Dashboard: https://vercel.com/dashboard

## Next Steps

- [ ] Bookmark your frontend URL
- [ ] Add bookmark to clinic computers
- [ ] Start adding your products and suppliers
- [ ] Share URL with clinic staff
- [ ] Set up regular backups (Railway does this automatically)

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Project README**: See README.md for development info
- **Detailed Guide**: See RAILWAY_DEPLOYMENT.md for more details
- **Quick Start**: See QUICK_START_RAILWAY.md for condensed steps
