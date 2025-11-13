# Deploy BOTH Backend and Frontend to Railway

This guide shows you how to deploy the complete application (backend + frontend + database) entirely on Railway.

## Why Railway Only?

- Everything in one place
- Simpler management
- One dashboard for everything
- Still FREE with $5/month credit

---

## 🚀 Step-by-Step Deployment

### Prerequisites

- [x] GitHub account
- [x] Railway account (sign up at https://railway.app with GitHub)
- [x] Code pushed to GitHub

---

## Step 1: Push to GitHub (If Not Done)

```bash
cd "/Users/mousbah/Documents/programming/msdc/product pricing"

# If not already initialized
git init
git add .
git commit -m "Initial commit"

# Add your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/dental-pricing-system.git
git branch -M main
git push -u origin main
```

---

## Step 2: Create Railway Project

1. Go to **https://railway.app**
2. Click **"Login"** → Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your **dental-pricing-system** repository
6. Railway will start deploying

---

## Step 3: Add PostgreSQL Database

1. In your Railway project dashboard, click **"New"**
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Wait for it to provision (1-2 minutes)
5. PostgreSQL service will appear in your dashboard

---

## Step 4: Configure Backend Service

### 4.1 Set Root Directory

1. Click on your **backend service** (the one from GitHub)
2. Go to **"Settings"** tab
3. Find **"Service"** section
4. Set **Root Directory**: `backend`
5. Changes save automatically

### 4.2 Set Environment Variables

1. Still in your backend service
2. Go to **"Variables"** tab
3. Click **"New Variable"**
4. Add:
   - **Name**: `NODE_ENV`
   - **Value**: `production`
5. **Note**: DATABASE_URL is automatically connected from PostgreSQL service

### 4.3 Generate Backend Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://dental-backend-production.up.railway.app`)
5. **SAVE THIS URL** - you'll need it for frontend!

### 4.4 Verify Backend is Running

1. Go to **"Deployments"** tab
2. Wait for "Success" status (2-3 minutes)
3. Visit: `https://YOUR-BACKEND-URL/health`
4. Should see: `{"status":"ok","timestamp":"..."}`

---

## Step 5: Add Frontend Service

### 5.1 Add New Service

1. In your Railway project dashboard, click **"New"**
2. Select **"GitHub Repo"**
3. Choose the **same repository** again
4. Click **"Add Service"**

### 5.2 Configure Frontend Service

1. Click on the **new service** (we'll configure it as frontend)
2. Go to **"Settings"** tab
3. Set **Root Directory**: `frontend`

### 5.3 Configure Build Settings

Still in Settings:

1. Find **"Build"** section
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npx vite preview --host 0.0.0.0 --port $PORT`

### 5.4 Add Frontend Environment Variables

1. Go to **"Variables"** tab
2. Click **"New Variable"**
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://YOUR-BACKEND-URL/api` (from Step 4.3)
   - **Important**: Make sure to add `/api` at the end!

Example: `https://dental-backend-production.up.railway.app/api`

### 5.5 Generate Frontend Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://dental-frontend-production.up.railway.app`)

### 5.6 Wait for Deployment

1. Go to **"Deployments"** tab
2. Wait for "Success" status (2-3 minutes)
3. Visit your frontend URL
4. You should see your application!

---

## Step 6: Update Backend CORS (Optional but Recommended)

To ensure backend only accepts requests from your frontend:

1. Note your frontend URL
2. This is already configured in the code to accept Railway domains
3. No changes needed! The backend automatically allows `.railway.app` domains

---

## Step 7: Test Your Application

### Test Backend
Visit: `https://YOUR-BACKEND-URL/health`

Should see:
```json
{"status":"ok","timestamp":"2025-..."}
```

### Test Frontend
1. Visit your frontend URL
2. Click **"Companies"** → **"Add Company"**
3. Fill in company details
4. Click "Add Company"
5. Should work! ✅

### Test Full Flow
1. Add a company
2. Add a product
3. Record a purchase
4. View price comparison
5. Check dashboard

---

## 🎯 Your Railway Project Structure

After setup, you'll have **3 services**:

```
Your Railway Project
├── 🗄️ PostgreSQL (Database)
├── 🔧 Backend Service (API)
│   └── https://your-backend.up.railway.app
└── 🎨 Frontend Service (UI)
    └── https://your-frontend.up.railway.app
```

---

## 📝 Environment Variables Summary

### Backend Service
- `NODE_ENV` = `production`
- `DATABASE_URL` = (automatically set by Railway)
- `PORT` = (automatically set by Railway)

### Frontend Service
- `VITE_API_URL` = `https://your-backend.up.railway.app/api`

### PostgreSQL Service
- No manual configuration needed

---

## 💰 Cost Estimate

Railway Free Tier:
- $5 credit per month
- PostgreSQL: ~$2/month
- Backend: ~$2/month
- Frontend: ~$1/month
- **Total: ~$5/month = FREE** (within credit)

---

## 🔄 Updating Your App

After initial deployment, updates are automatic:

```bash
# Make changes to your code
git add .
git commit -m "Your changes description"
git push

# Railway automatically deploys BOTH services!
# Wait 2-3 minutes for both to update
```

---

## 🎨 Rename Services (Optional)

To make it clearer which service is which:

1. Click on a service
2. Go to **"Settings"** tab
3. Find **"Service Name"**
4. Rename:
   - First service → `dental-backend`
   - Second service → `dental-frontend`
   - Database stays as `PostgreSQL`

---

## 🐛 Troubleshooting

### Backend Won't Start

**Check:**
- Root Directory = `backend` ✓
- DATABASE_URL exists in Variables (automatic)
- View logs: Deployments → Latest → View Logs

**Common Issues:**
- Wrong root directory
- Database not connected
- Build failed (check logs)

### Frontend Won't Start

**Check:**
- Root Directory = `frontend` ✓
- VITE_API_URL is set correctly
- URL ends with `/api`
- Build command is correct

**Common Issues:**
- Missing VITE_API_URL
- Wrong backend URL
- Build command incorrect

### Frontend Can't Connect to Backend

**Check:**
1. Backend is running (visit `/health` endpoint)
2. VITE_API_URL is correct in frontend variables
3. URL includes `/api` at the end
4. No typos in the URL

**Fix:**
1. Go to Frontend service → Variables
2. Update VITE_API_URL if wrong
3. Redeploy frontend (it will auto-deploy)

### "Database connection failed"

**Check:**
1. PostgreSQL service is running (green status)
2. Backend has DATABASE_URL variable (should be automatic)

**Fix:**
1. Go to PostgreSQL service
2. Click "Connect" tab
3. Copy DATABASE_URL
4. Go to Backend service → Variables
5. Add DATABASE_URL manually if not there

---

## 📊 Monitoring

### View Logs

**Backend:**
1. Click Backend service
2. Deployments → Latest deployment
3. Click "View Logs"

**Frontend:**
1. Click Frontend service
2. Deployments → Latest deployment
3. Click "View Logs"

### Check Resource Usage

1. Go to Railway Dashboard
2. Click on your project
3. View "Usage" section
4. Monitor credit consumption

---

## 🔐 Database Access

### View Database Data

1. Click on PostgreSQL service
2. Go to "Data" tab
3. You can query your database directly

### Database Connection String

1. Click on PostgreSQL service
2. Go to "Connect" tab
3. Copy connection string
4. Use with tools like pgAdmin, TablePlus, etc.

---

## 🎯 Important URLs

After deployment, save these URLs:

```
Frontend (Your App):
https://your-frontend.up.railway.app

Backend API:
https://your-backend.up.railway.app

Backend Health Check:
https://your-backend.up.railway.app/health

Railway Dashboard:
https://railway.app/dashboard
```

---

## ✅ Success Checklist

- [ ] PostgreSQL database created and running
- [ ] Backend service deployed (root: `backend`)
- [ ] Backend health check returns OK
- [ ] Frontend service deployed (root: `frontend`)
- [ ] Frontend environment variable set (VITE_API_URL)
- [ ] Can access frontend in browser
- [ ] Can add a company (test create)
- [ ] Can add a product (test create)
- [ ] Can record a purchase (test full flow)
- [ ] Dashboard shows data

---

## 🚀 You're Live!

Your dental pricing system is now fully deployed on Railway!

**Share your frontend URL with your clinic staff:**
`https://your-frontend.up.railway.app`

---

## 📞 Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Your project files: See README.md

---

## 🔥 Quick Reference Commands

```bash
# Update your app
git add .
git commit -m "Update message"
git push
# Railway auto-deploys!

# View status
railway status

# View logs
railway logs --service backend
railway logs --service frontend

# Connect to database
railway connect
```

---

**Congratulations!** Your application is now live on Railway! 🎉
