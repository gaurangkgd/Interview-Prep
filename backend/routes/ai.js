const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { generateInterviewQuestions } = require('../utils/aiService');

// POST /api/ai/generate-questions - Generate AI interview questions
router.post('/generate-questions', verifyToken, async (req, res) => {
  try {
    const { role, topic, difficulty, count } = req.body;
    
    // Validation
    if (!role || !topic || !difficulty || !count) {
      return res.status(400).json({ 
        message: 'Missing required fields: role, topic, difficulty, count' 
      });
    }
    
    if (count < 1 || count > 20) {
      return res.status(400).json({ 
        message: 'Count must be between 1 and 20' 
      });
    }
    
    console.log(`Generating ${count} ${difficulty} questions for ${role} - ${topic}`);
    
    const result = await generateInterviewQuestions({
      role,
      topic,
      difficulty,
      count: parseInt(count)
    });
    
    if (result.success) {
      res.status(200).json({
        success: true,
        questions: result.questions,
        metadata: result.metadata
      });
    } else {
      // Even if AI fails, return fallback questions as success
      res.status(200).json({
        success: true,
        message: 'Using fallback questions due to AI service issue',
        questions: result.questions
      });
    }
    
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
});

module.exports = router;
