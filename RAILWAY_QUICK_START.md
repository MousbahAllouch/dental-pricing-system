# Quick Start: Deploy Everything to Railway (10 Minutes)

Deploy backend, frontend, and database all on Railway.

---

## Step 1: Push to GitHub (2 minutes)

```bash
cd "/Users/mousbah/Documents/programming/msdc/product pricing"

# Create repo on GitHub: https://github.com/new
# Name it: dental-pricing-system
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/dental-pricing-system.git
git branch -M main
git push -u origin main
```

---

## Step 2: Setup Railway Project (3 minutes)

1. **Go to**: https://railway.app
2. **Login** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select** your dental-pricing-system repo
5. **Add Database**: Click "New" → "Database" → "PostgreSQL"

---

## Step 3: Configure Backend (2 minutes)

1. **Click** on your backend service (from GitHub)
2. **Settings** → Root Directory: `backend`
3. **Variables** → Add: `NODE_ENV` = `production`
4. **Settings** → Networking → **Generate Domain**
5. **Copy backend URL** (save it!)

---

## Step 4: Add Frontend Service (3 minutes)

1. **Click "New"** → **GitHub Repo** → Same repo
2. **Click** the new service
3. **Settings** → Root Directory: `frontend`
4. **Variables** → Add:
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL/api` (from Step 3)
5. **Settings** → Networking → **Generate Domain**

---

## Step 5: Test (1 minute)

1. Visit backend: `https://your-backend.up.railway.app/health`
2. Visit frontend: `https://your-frontend.up.railway.app`
3. Add a company to test!

---

## ✅ Done! Your App is Live!

**Your Services:**
- 🎨 Frontend: `https://your-frontend.up.railway.app`
- 🔧 Backend: `https://your-backend.up.railway.app`
- 🗄️ Database: PostgreSQL (internal)

**Cost:** FREE ($5 credit/month covers everything)

---

## 🔄 To Update Later:

```bash
git add .
git commit -m "Your changes"
git push
# Railway auto-deploys!
```

---

## 📖 Need More Details?

See [RAILWAY_ONLY_DEPLOYMENT.md](RAILWAY_ONLY_DEPLOYMENT.md) for complete instructions.

---

## 🐛 Common Issues:

**Frontend can't connect to backend:**
- Check VITE_API_URL includes `/api` at the end
- Example: `https://backend.up.railway.app/api`

**Backend won't start:**
- Check Root Directory = `backend`
- Check DATABASE_URL exists (automatic)

**Frontend won't start:**
- Check Root Directory = `frontend`
- Check VITE_API_URL is set
