# Interview Prep Tracker

A full-stack web application to track job applications, interview questions, and preparation progress.

## Features
- 🔐 User Authentication (JWT)
- 🏢 Company Application Tracking
- 📝 Interview Questions Bank
- ✅ Preparation Checklist
- 📊 Dashboard with Statistics

## Tech Stack
**Frontend:** React, Tailwind CSS  
**Backend:** Node.js, Express  
**Database:** MongoDB  
**Authentication:** JWT tokens

## Setup Instructions

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create `.env` files:

**backend/.env:**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

**frontend/.env:**
```
REACT_APP_API_URL=http://localhost:5000
```

## Author
Gaurang Gade - https://github.com/gaurangkgd/