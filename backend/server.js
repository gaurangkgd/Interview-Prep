const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const companiesRoutes = require('./routes/companies');
const questionsRoutes = require('./routes/questions');
const prepItemsRoutes = require('./routes/prepItems');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Add this line
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interview-prep-tracker')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/prep-items', prepItemsRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});