require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const companiesRoutes = require('./routes/companies');
const questionsRoutes = require('./routes/questions');
const prepItemsRoutes = require('./routes/prepItems');
const aiRoutes = require('./routes/ai');
const { testEmailConnection } = require('./utils/emailService');
const { scheduleInterviewReminders } = require('./utils/cronJobs');
const { testAIConnection } = require('./utils/aiService');
const resourceRoutes = require('./routes/resources');


const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-prep-tracker')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Test email service on startup
testEmailConnection();

// Test AI service on startup
testAIConnection();

// Schedule interview reminders
scheduleInterviewReminders();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/prep-items', prepItemsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resources', resourceRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});