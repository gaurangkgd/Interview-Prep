# Quick Start Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. MongoDB Atlas Setup (5 minutes)
- [ ] Create account at https://www.mongodb.com/cloud/atlas/register
- [ ] Create FREE M0 cluster
- [ ] Create database user (save username/password)
- [ ] Whitelist all IPs (0.0.0.0/0)
- [ ] Copy connection string

### 3. Groq AI API Key (2 minutes)
- [ ] Sign up at https://console.groq.com/
- [ ] Create API key
- [ ] Copy the key

### 4. Gmail App Password (3 minutes)
- [ ] Enable 2-Step Verification in Google Account
- [ ] Generate App Password at https://myaccount.google.com/apppasswords
- [ ] Copy 16-character password

---

## 🚀 Backend Deployment (Railway - 5 minutes)

1. **Go to Railway**: https://railway.app/
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select your repository**
5. **Settings** → Set Root Directory to `backend`
6. **Variables** → Add these:

```
MONGODB_URI=mongodb+srv://username:password@cluster.xxx.mongodb.net/interview-prep-tracker
JWT_SECRET=your_random_32_character_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
GROQ_API_KEY=your_groq_api_key
PORT=3000
```

7. **Copy your Railway URL** (e.g., `https://yourapp.up.railway.app`)

---

## 🎨 Frontend Deployment (Vercel - 3 minutes)

1. **Go to Vercel**: https://vercel.com/
2. **Sign up** with GitHub
3. **New Project** → **Import your repository**
4. **Configure**:
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables** → Add:
```
VITE_API_URL=https://yourapp.up.railway.app/api
```
(Use your Railway URL from step 7 above)

6. **Click Deploy**

---

## ✅ Verification (2 minutes)

1. **Visit your Vercel URL** (e.g., `https://yourapp.vercel.app`)
2. **Register a new account**
3. **Test login**
4. **Create a company**
5. **Generate AI questions**

---

## 🎉 Done!

**Total Time**: ~20 minutes

Your app is now live and FREE!

### Your URLs:
- **Frontend**: `https://yourapp.vercel.app`
- **Backend**: `https://yourapp.up.railway.app`

---

## 📝 Important Notes

1. **Railway Free Tier**: $5 credit/month (resets monthly) - enough for ~500 hours
2. **MongoDB Free Tier**: 512MB storage - enough for development/small projects
3. **Vercel Free Tier**: Unlimited deployments, 100GB bandwidth/month

4. **Auto-Deploy**: Both Railway and Vercel auto-deploy when you push to GitHub main branch

---

## 🔧 Generate JWT Secret

Run this in terminal to generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ⚠️ Common Issues

### Backend: "Module not found"
- Check Root Directory is set to `backend` in Railway

### Frontend: "Network Error"
- Verify `VITE_API_URL` matches your Railway URL
- Add `/api` at the end of Railway URL

### Database: "Connection failed"
- Check MongoDB connection string is correct
- Verify IP whitelist includes 0.0.0.0/0
- Ensure password has no special characters or is URL-encoded

### Email: Not sending
- Verify Gmail App Password (16 characters, no spaces)
- Check 2-Step Verification is enabled

---

## 🆘 Need Help?

Refer to the full **DEPLOYMENT_GUIDE.md** for detailed instructions and troubleshooting.

**Good luck! 🚀**
