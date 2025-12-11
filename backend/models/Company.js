const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Applied', 'Screening', 'Interview Scheduled', 'Offer Received', 'Rejected', 'Accepted'],
    default: 'Applied',
  },
  appliedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  interviewDate: {  // NEW FIELD
    type: Date,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Company', companySchema);