# Interview Prep Tracker

A modern, full-stack web application to track job applications, manage interview questions, and organize your preparation progress. Built with React, Node.js, Express, and MongoDB.

🔗 **Live Demo**: [Add your deployment URL here]  
📦 **GitHub**: https://github.com/gaurangkgd/Interview-Prep

---

## 🚀 Features

- **🔐 User Authentication**: Secure JWT-based registration, login, and protected routes
- **🏢 Application Tracking**: Add, edit, delete, and filter companies by status (Applied, Screening, Interview Scheduled, Offer Received, Accepted, Rejected)
- **📊 Dashboard Analytics**: Real-time stats showing total applications, interviews, offers, and rejections
- **🎨 Modern UI**: Glassmorphic design with animated aurora background, smooth hover effects, and Tailwind CSS v4
- **📝 Question Bank**: Store and manage technical interview questions
- **✅ Prep Checklist**: Track preparation items and resources
- **🤖 AI Question Generator**: Generate interview questions using OpenAI (optional feature)
- **🔍 Search & Filter**: Quickly find companies and filter by application status

---

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| **Frontend** | React 18, Vite, Tailwind CSS v4, React Router, Framer Motion, GSAP |
| **Backend**  | Node.js, Express.js, Mongoose (MongoDB ODM)    |
| **Database** | MongoDB Atlas                                   |
| **Auth**     | JWT (JSON Web Tokens), bcrypt                   |
| **AI**       | OpenAI API (optional)                           |
| **Deployment** | Vercel (frontend), Railway/Render (backend)   |

---

## 📦 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/gaurangkgd/Interview-Prep.git
cd interview-prep-tracker1
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview-prep
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
OPENAI_API_KEY=sk-your-openai-key-here  # Optional
```

Start the backend server:
```bash
npm start
```
Server runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

Start the development server:
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 🎯 Usage

1. **Register/Login**: Create an account or log in with existing credentials
2. **Add Companies**: Click "Add Company" to track a new application
3. **Update Status**: Use the status dropdown to update application progress
4. **View Dashboard**: Monitor your application stats at a glance
5. **Filter Applications**: Use the status filters to quickly find companies
6. **Generate Questions**: (Optional) Use the AI generator to create interview prep questions

---

## 📂 Project Structure

```
interview-prep-tracker1/
├── backend/
│   ├── models/          # Mongoose schemas (User, Company, Question, etc.)
│   ├── routes/          # Express route handlers
│   ├── middleware/      # Auth middleware
│   ├── utils/           # AI service, email service, cron jobs
│   └── server.js        # Main Express app
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (Dashboard, Home, etc.)
│   │   ├── context/     # AuthContext for global state
│   │   └── utils/       # API client
│   └── vite.config.js   # Vite configuration
└── README.md
```

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```
Set environment variable: `VITE_API_URL=https://your-backend-url.railway.app`

### Backend (Railway/Render)
- Connect your GitHub repo
- Set root directory to `backend/`
- Add environment variables from `.env`
- Deploy!

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Gaurang Gade**  
- GitHub: [@gaurangkgd](https://github.com/gaurangkgd)
- LinkedIn: [Add your LinkedIn URL]
- Portfolio: [Add your portfolio URL]

---

## 🙏 Acknowledgments

- Tailwind CSS for the amazing utility-first framework
- React community for excellent documentation
- MongoDB Atlas for reliable cloud database hosting

---

**⭐ If you found this project helpful, please give it a star!**