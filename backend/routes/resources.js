const express = require('express');
const router = express.Router();
const Resource = require('../models/Resources');
const verifyToken = require('../middleware/auth');

// GET all resources
router.get('/', verifyToken, async (req, res) => {
  try {
    const { topic, studied, type } = req.query;
    const filter = { userId: req.userId };
    
    if (topic) filter.topic = topic;
    if (studied !== undefined) filter.studied = studied === 'true';
    if (type) filter.type = type;

    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 })
      .populate('companyId', 'companyName');
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create resource
router.post('/', verifyToken, async (req, res) => {
  try {
    const resource = new Resource({
      userId: req.userId,
      ...req.body
    });
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update resource
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE resource
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH toggle studied status
router.patch('/:id/toggle-studied', verifyToken, async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    
    resource.studied = !resource.studied;
    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;