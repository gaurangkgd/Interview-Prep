const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Article', 'Video', 'Course', 'Book', 'Tutorial', 'Documentation'],
    default: 'Article'
  },
  topic: { type: String, required: true }, // React, Node.js, etc.
  description: String,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // Optional
  studied: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 5 }, // User's rating
  notes: String, // Personal notes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', ResourceSchema);