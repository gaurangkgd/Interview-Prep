const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const verifyToken = require('../middleware/auth');

// All routes are protected - need JWT token

// GET /api/questions - Get all questions for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.userId })
      .populate('companyId', 'companyName role')  // Include company details
      .sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/questions/company/:companyId - Get questions for specific company
router.get('/company/:companyId', verifyToken, async (req, res) => {
  try {
    const questions = await Question.find({ 
      userId: req.userId,
      companyId: req.params.companyId 
    }).sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/questions/:id - Get single question
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const question = await Question.findOne({ _id: req.params.id, userId: req.userId })
      .populate('companyId', 'companyName role');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/questions - Create new question
router.post('/', verifyToken, async (req, res) => {
  try {
    const { question, answer, topic, companyId } = req.body;
    
    console.log('📝 Creating question:', { question, topic, hasCompanyId: !!companyId });
    
    const newQuestion = new Question({
      question,
      answer,
      topic,
      companyId: companyId || null,  // Explicitly set to null if not provided
      userId: req.userId  // From verified token
    });
    
    await newQuestion.save();
    console.log('✅ Question saved successfully:', newQuestion._id);
    res.status(201).json({ message: 'Question added successfully', question: newQuestion });
  } catch (error) {
    console.error('❌ Error saving question:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/questions/:id - Update question
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { question, answer, topic, companyId } = req.body;
    
    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { question, answer, topic, companyId },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.status(200).json({ message: 'Question updated successfully', question: updatedQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/questions/:id - Delete question
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const question = await Question.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;