# 🚀 Deploy to Render (Free) - Step by Step Guide

## Overview
Deploy your Interview Prep Tracker on Render for **FREE**:
- **Backend**: Render Web Service (Free tier)
- **Frontend**: Vercel (Free tier) 
- **Database**: MongoDB Atlas (Already set up ✅)

---

## 📋 Prerequisites

✅ MongoDB Atlas already configured  
✅ Code working locally  
⬜ Push code to GitHub  
⬜ Render account  
⬜ Vercel account  

---

## Step 1: Push to GitHub (2 minutes)

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

---

## Step 2: Deploy Backend to Render (5 minutes)

### 2.1 Create Render Account
1. Go to https://render.com/
2. Click **"Get Started for Free"**
3. Sign up with **GitHub**

### 2.2 Create Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** to connect GitHub
4. Find and select your repository: **Interview-Prep**

### 2.3 Configure Web Service

Fill in these settings:

**Basic Settings:**
```
Name: interview-prep-backend
Region: Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

**Plan:**
```
Instance Type: Free
```

### 2.4 Add Environment Variables

Click **"Advanced"** → Scroll to **"Environment Variables"**

Add these variables (click "Add Environment Variable" for each):

```
MONGODB_URI=mongodb+srv://garyg16:Interview%401608@cluster0.kgsb9mp.mongodb.net/interview-prep-tracker?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=6a151266c49b6c8ec43b208e3cf05c92903d6efe496f25acdf04003e617e02ec1b87dcd3c380ceae1bea7af152a32ee493df052b60accb5ac81662c441590bdb

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_16_char_app_password

GROQ_API_KEY=your_groq_api_key

PORT=3000

FRONTEND_URL=https://your-app.vercel.app
```

**Note:** You'll update `FRONTEND_URL` after deploying frontend in Step 3

### 2.5 Create Web Service

1. Click **"Create Web Service"**
2. Render will start building and deploying (takes 2-3 minutes)
3. Wait for status to show **"Live"** (green dot)

### 2.6 Get Your Backend URL

Once deployed, you'll see your service URL:
```
https://interview-prep-backend.onrender.com
```

**Copy this URL - you'll need it for frontend!**

---

## Step 3: Deploy Frontend to Vercel (3 minutes)

### 3.1 Create Vercel Account

1. Go to https://vercel.com/
2. Click **"Sign Up"**
3. Sign up with **GitHub**

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find and **Import** your GitHub repository
3. Configure project:

**Settings:**
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.3 Add Environment Variable

Click **"Environment Variables"** and add:

```
Name: VITE_API_URL
Value: https://interview-prep-backend.onrender.com/api
```

**Replace with your actual Render backend URL from Step 2.6**

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for build to complete
3. You'll get a URL like: `https://interview-prep-xyz.vercel.app`

---

## Step 4: Update Backend FRONTEND_URL (2 minutes)

### 4.1 Update Render Environment Variable

1. Go back to **Render Dashboard**
2. Click on your **interview-prep-backend** service
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` variable
5. Update value to your Vercel URL: `https://interview-prep-xyz.vercel.app`
6. Click **"Save Changes"**
7. Render will automatically redeploy (takes 1-2 minutes)

---

## Step 5: Test Your Deployed App (3 minutes)

### 5.1 Visit Your Frontend

Go to your Vercel URL: `https://interview-prep-xyz.vercel.app`

### 5.2 Test Full Flow

1. ✅ Register a new account
2. ✅ Login
3. ✅ Create a company
4. ✅ Add questions
5. ✅ Generate AI questions
6. ✅ Add resources
7. ✅ Create prep items

---

## 🎉 Success!

Your app is now **LIVE** and **FREE**!

**Your URLs:**
- 🌐 Frontend: `https://your-app.vercel.app`
- 🔧 Backend: `https://interview-prep-backend.onrender.com`
- 🗄️ Database: MongoDB Atlas

---

## ⚠️ Important: Render Free Tier Limitations

### Cold Starts
- **Free tier spins down after 15 minutes of inactivity**
- First request after inactivity takes **30-60 seconds**
- Subsequent requests are fast

### How to Handle Cold Starts:

**Option 1: Accept the delay** (Recommended for personal projects)
- Just wait 30-60 seconds on first load after inactivity
- Add a loading message to your frontend

**Option 2: Keep-alive service** (Free)
- Use a free service like UptimeRobot or Cron-job.org
- Ping your backend every 14 minutes to keep it awake
- Setup: https://uptimerobot.com/ → Add monitor with your backend URL

**Option 3: Upgrade to paid tier** ($7/month)
- No cold starts
- Always-on service

---

## 🔄 Automatic Deployments

### Backend (Render)
- Push to `main` branch → Render auto-deploys in 2-3 minutes

### Frontend (Vercel)  
- Push to `main` branch → Vercel auto-deploys in 1-2 minutes

---

## 📊 Monitor Your Deployment

### Render Dashboard
- View logs: Click service → "Logs" tab
- Monitor usage: "Metrics" tab
- Check status: Green dot = Live

### Vercel Dashboard
- View deployments: Project → "Deployments"
- Check analytics: "Analytics" tab
- Monitor performance: Built-in metrics

---

## 🐛 Troubleshooting

### Backend: "Application failed to respond"
- Check Render logs for errors
- Verify all environment variables are set correctly
- Ensure Root Directory is `backend`
- Check Start Command is `node server.js`

### Frontend: "Network Error" or CORS issues
- Verify `VITE_API_URL` matches your Render backend URL
- Ensure backend `FRONTEND_URL` matches your Vercel URL
- Check both services are deployed and live

### Database: Connection issues
- Verify MongoDB URI in Render environment variables
- Check MongoDB Atlas whitelist includes 0.0.0.0/0
- Ensure password special characters are URL-encoded

### Backend: Slow first load (30-60 seconds)
- This is normal for Render free tier (cold starts)
- Service spins down after 15 minutes of inactivity
- Consider using UptimeRobot to keep it alive

---

## 💰 Cost Breakdown

| Service | Cost | Limits |
|---------|------|--------|
| Render Free | $0 | 750 hours/month, Cold starts after 15 min |
| Vercel Free | $0 | 100GB bandwidth, Unlimited deployments |
| MongoDB Atlas M0 | $0 | 512MB storage, Shared RAM |

**Total: $0/month** ✅

---

## 🎯 Next Steps

1. **Custom Domain** (Optional)
   - Buy domain from Namecheap/GoDaddy
   - Add to Vercel (free SSL included)

2. **Keep Backend Alive** (Optional)
   - Setup UptimeRobot: https://uptimerobot.com/
   - Monitor URL: `https://your-backend.onrender.com/api/auth/test`
   - Interval: Every 14 minutes

3. **Email Notifications**
   - Already configured with Gmail ✅
   - Test by creating companies with interview dates

4. **Monitor Usage**
   - Render: Check "Metrics" for usage
   - Vercel: Check "Analytics" for traffic
   - MongoDB: Check Atlas dashboard for storage

---

## 📝 Environment Variables Summary

### Backend (Render)
```
MONGODB_URI     - Your MongoDB Atlas connection string
JWT_SECRET      - Random 64-character string for JWT tokens
EMAIL_USER      - Your Gmail address
EMAIL_PASS      - Gmail app-specific password (16 chars)
GROQ_API_KEY    - Groq AI API key for question generation
PORT            - 3000
FRONTEND_URL    - Your Vercel frontend URL
```

### Frontend (Vercel)
```
VITE_API_URL    - Your Render backend URL + /api
```

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Issues**: Create issue in your repository

---

**Congratulations! Your app is now deployed and accessible worldwide! 🌍🎉**
