const express = require('express');
const router = express.Router();
const PrepItem = require('../models/PrepItem');
const verifyToken = require('../middleware/auth');

// All routes are protected - need JWT token

// GET /api/prep-items - Get all prep items for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const prepItems = await PrepItem.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(prepItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/prep-items/:id - Get single prep item
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const prepItem = await PrepItem.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!prepItem) {
      return res.status(404).json({ message: 'Prep item not found' });
    }
    
    res.status(200).json(prepItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/prep-items - Create new prep item
router.post('/', verifyToken, async (req, res) => {
  try {
    const { topic, description, priority, completed } = req.body;
    
    console.log('Received POST data:', { topic, description, priority, completed });
    
    const prepItem = new PrepItem({
      topic,
      description,
      priority: priority || 'Medium',
      completed: completed || false,
      userId: req.userId  // From verified token
    });
    
    await prepItem.save();
    console.log('Saved prep item:', prepItem);
    res.status(201).json({ message: 'Prep item added successfully', prepItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/prep-items/:id - Update prep item
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { topic, description, priority, completed } = req.body;
    
    const prepItem = await PrepItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { topic, description, priority, completed },
      { new: true, runValidators: true }
    );
    
    if (!prepItem) {
      return res.status(404).json({ message: 'Prep item not found' });
    }
    
    res.status(200).json({ message: 'Prep item updated successfully', prepItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/prep-items/:id/toggle - Toggle completed status
router.patch('/:id/toggle', verifyToken, async (req, res) => {
  try {
    const prepItem = await PrepItem.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!prepItem) {
      return res.status(404).json({ message: 'Prep item not found' });
    }
    
    prepItem.completed = !prepItem.completed;
    await prepItem.save();
    
    res.status(200).json({ message: 'Prep item status toggled', prepItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/prep-items/:id - Delete prep item
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const prepItem = await PrepItem.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!prepItem) {
      return res.status(404).json({ message: 'Prep item not found' });
    }
    
    res.status(200).json({ message: 'Prep item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;