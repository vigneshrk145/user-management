# Vercel Deployment - Environment Variable Setup

## Problem
Your Vercel deployment is getting a **500 error** because the frontend is trying to call the backend API, but the environment variable `VITE_API_URL` is not set.

## Solution
Follow these exact steps:

### Step 1: Commit and Push Your Changes
```bash
git add .
git commit -m "Fix: Add API configuration for Vercel deployment"
git push
```

### Step 2: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click on your project **"user-management-lyart-seven"**
3. Go to **Settings** tab (at the top)

### Step 3: Add Environment Variable
1. Click **"Environment Variables"** (left sidebar)
2. Click **"Add New"** button
3. Fill in:
   - **Name**: `VITE_API_URL`
   - **Value**: `/api/users`
   - **Environments**: Check only "Production"
4. Click **"Save"**

### Step 4: Redeploy
1. Go back to **Deployments** tab
2. Click the three dots (⋯) on your latest deployment
3. Select **"Redeploy"**
4. Wait for the deployment to complete

## How It Works

### Local Development (http://localhost:5174)
```
Frontend → /api/users (proxied to http://localhost:3001/users) → JSON Server
```

### Production (Vercel)
```
Frontend → /api/users (routed to Vercel serverless function) → db.json
```

Your API route at `api/users.js` will handle the GET request and return data from `db.json`.

## Testing
After redeployment:
1. Visit https://user-management-lyart-seven.vercel.app/
2. Check browser DevTools → Network tab
3. You should see GET /api/users returning 200 with your user data

## Note
Write operations (POST/PUT/DELETE) will return 501 "Not Implemented" on Vercel because the serverless function can't persistently modify files. For full CRUD with persistence, you'll need a real backend (Node/Express, Firebase, MongoDB Atlas, etc.).
