# 🚀 Free Deployment Guide for Interview Prep Tracker

## Overview
This guide will help you deploy your full-stack application completely **FREE** using:
- **Frontend**: Vercel (Free tier)
- **Backend**: Railway or Render (Free tier)
- **Database**: MongoDB Atlas (Free tier - 512MB)

---

## 📋 Prerequisites

1. GitHub account
2. Email account for deployment services
3. Push your code to GitHub repository

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create Free MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Click **"Build a Database"**
4. Select **"M0 FREE"** tier (512MB storage)
5. Choose a cloud provider and region (closest to you)
6. Click **"Create Cluster"**

### 1.2 Configure Database Access

1. In Atlas, go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Create username and password (save these!)
4. Set privileges to **"Read and write to any database"**
5. Click **"Add User"**

### 1.3 Configure Network Access

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.xxx.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Add database name: `mongodb+srv://username:password@cluster.xxx.mongodb.net/interview-prep-tracker`

---

## 🔧 Step 2: Deploy Backend (Railway - Recommended)

### Option A: Railway (Easiest)

1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub
3. Click **"New Project"**
4. Choose **"Deploy from GitHub repo"**
5. Select your repository
6. Railway will auto-detect Node.js

### 2.1 Add Environment Variables

In Railway project settings, add these variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=generate_random_32_character_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
GROQ_API_KEY=your_groq_api_key
PORT=3000
```

### 2.2 Set Root Directory

1. In Railway project settings
2. Set **"Root Directory"** to `backend`
3. Railway will automatically deploy

### 2.3 Get Backend URL

- Railway will provide a URL like: `https://your-app.up.railway.app`
- Save this URL for frontend configuration

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Deploy to Vercel

1. Go to [Vercel](https://vercel.com/)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Add Environment Variable

In Vercel project settings, add:

```
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

Replace with your actual Railway backend URL.

### 3.3 Deploy

- Click **"Deploy"**
- Vercel will build and deploy your frontend
- You'll get a URL like: `https://your-app.vercel.app`

---

## 🔐 Step 4: Configure CORS

Update your backend to allow your frontend domain:

1. In your backend `server.js`, the CORS is already configured
2. Make sure your Railway environment has the frontend URL
3. Or update the cors configuration if needed

---

## 📧 Step 5: Setup Email (Gmail App Password)

### 5.1 Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **"2-Step Verification"**

### 5.2 Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: **"Mail"**
3. Select device: **"Other"** (name it "Interview Prep Tracker")
4. Click **"Generate"**
5. Copy the 16-character password
6. Add to Railway environment variables as `EMAIL_PASS`

---

## 🤖 Step 6: Setup Groq AI (Free API)

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up for free account
3. Go to **"API Keys"**
4. Click **"Create API Key"**
5. Copy the key
6. Add to Railway environment variables as `GROQ_API_KEY`

---

## ✅ Step 7: Test Your Deployment

### 7.1 Test Backend

Visit: `https://your-backend.up.railway.app/api/auth/test`

### 7.2 Test Frontend

Visit: `https://your-app.vercel.app`

### 7.3 Test Full Flow

1. Register a new user
2. Login
3. Create a company
4. Generate AI questions
5. Add resources
6. Test email notifications

---

## 🔄 Step 8: Automatic Deployments

### Backend (Railway)
- Push to `main` branch → Railway auto-deploys

### Frontend (Vercel)
- Push to `main` branch → Vercel auto-deploys

---

## 💰 Free Tier Limits

### MongoDB Atlas (M0)
- ✅ 512MB storage
- ✅ Shared RAM
- ✅ Unlimited connections
- ⚠️ Good for 100-500 users

### Railway
- ✅ $5 free credit/month
- ✅ ~500 hours runtime
- ✅ 512MB RAM
- ⚠️ Credit resets monthly

### Vercel
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic SSL
- ✅ CDN included

---

## 🛠️ Alternative: Render (Backend)

If Railway doesn't work, use Render:

1. Go to [Render](https://render.com/)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Configure:
   - **Name**: interview-prep-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
6. Add environment variables (same as Railway)
7. Click **"Create Web Service"**

⚠️ **Note**: Render free tier spins down after 15 minutes of inactivity. First request after inactivity takes 30-60 seconds.

---

## 🐛 Troubleshooting

### Backend won't start
- Check Railway logs
- Verify all environment variables are set
- Check MongoDB connection string is correct

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct in Vercel
- Check CORS configuration in backend
- Ensure backend is running (check Railway)

### Database connection fails
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check username/password in connection string
- Ensure database user has read/write permissions

### Email not sending
- Verify Gmail app password is correct (16 characters, no spaces)
- Check 2-Step Verification is enabled
- Test with a different Gmail account

---

## 📊 Monitoring

### Railway Dashboard
- View logs
- Monitor usage
- Check deployments

### Vercel Dashboard
- View analytics
- Monitor builds
- Check performance

### MongoDB Atlas
- Monitor database size
- Check connection metrics
- View query performance

---

## 🎉 You're Live!

Your app is now deployed for **FREE**! Share your URLs:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.up.railway.app`

---

## 📝 Next Steps

1. **Custom Domain**: Add custom domain in Vercel (free with your own domain)
2. **Analytics**: Add Google Analytics or Vercel Analytics
3. **Monitoring**: Use free monitoring tools like UptimeRobot
4. **Backup**: MongoDB Atlas provides automated backups

---

## 💡 Tips for Free Tier

1. **Railway**: Monitor your monthly credit usage
2. **MongoDB**: Keep database under 512MB
3. **Vercel**: Optimize images and assets
4. **Render**: Accept 15-min spin-down delay or upgrade to paid tier

---

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- GitHub Issues: Create an issue in your repository

---

**Good luck with your deployment! 🚀**
