# Quick Start: Deploy to Railway in 10 Minutes

## Step 1: Push to GitHub (2 minutes)

```bash
cd "/Users/mousbah/Documents/programming/msdc/product pricing"

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin YOUR_GITHUB_URL
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend on Railway (3 minutes)

1. **Go to Railway**: https://railway.app
2. **Login** with GitHub
3. **New Project** → **Deploy from GitHub repo** → Select your repo
4. **Add PostgreSQL**:
   - Click "New" → "Database" → "PostgreSQL"
5. **Configure Backend Service**:
   - Click on your service (from GitHub)
   - Settings → Root Directory: `backend`
   - Variables → Add `NODE_ENV=production`
   - Settings → Generate Domain (copy this URL!)

## Step 3: Deploy Frontend on Vercel (3 minutes)

1. **Go to Vercel**: https://vercel.com
2. **Login** with GitHub
3. **New Project** → Import your repo
4. **Configure**:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - **Environment Variable**:
     - Name: `VITE_API_URL`
     - Value: `https://your-backend.railway.app/api` (from Step 2)
5. **Deploy**

## Step 4: Test (2 minutes)

1. Visit your Vercel URL
2. Add a company
3. Add a product
4. Record a purchase
5. View price comparison

## Done! Your app is live!

---

## Important URLs

**Backend Health Check**: `https://your-backend.railway.app/health`
**Frontend**: `https://your-app.vercel.app`
**Database**: Railway Dashboard → PostgreSQL → Connect

---

## Common Issues

### Backend won't start
- Check Railway logs
- Verify DATABASE_URL is set (automatic from PostgreSQL service)
- Make sure Root Directory = `backend`

### Frontend can't connect to backend
- Check VITE_API_URL includes `/api` at the end
- Example: `https://your-backend.railway.app/api`
- Test backend health: visit `https://your-backend.railway.app/health`

### Database errors
- Railway automatically provides DATABASE_URL
- Check PostgreSQL service is running in Railway dashboard
- View logs in PostgreSQL service

---

## Environment Variables Summary

### Backend (Railway)
```
DATABASE_URL → Automatically set by Railway PostgreSQL
NODE_ENV → production
PORT → Automatically set by Railway
```

### Frontend (Vercel)
```
VITE_API_URL → https://your-backend.railway.app/api
```

---

## Update Your App

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Both Railway and Vercel auto-deploy!
```

---

## Costs

- **Railway**: $5 free credit/month (enough for small apps)
- **Vercel**: Free tier (unlimited for hobby projects)
- **Total**: FREE for personal/small clinic use

---

## Support

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Full deployment guide: See RAILWAY_DEPLOYMENT.md
