const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const verifyToken = require('../middleware/auth');

// All routes are protected - need JWT token

// GET /api/companies - Get all companies for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.userId }).sort({ appliedDate: -1 });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/companies/:id - Get single company
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/companies - Create new company
router.post('/', verifyToken, async (req, res) => {
  try {
    const { companyName, role, status, appliedDate } = req.body;
    
    const company = new Company({
      companyName,
      role,
      status,
      appliedDate,
      userId: req.userId  // From verified token
    });
    
    await company.save();
    res.status(201).json({ message: 'Company added successfully', company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/companies/:id - Update company
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { companyName, role, status, appliedDate } = req.body;
    
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { companyName, role, status, appliedDate },
      { new: true, runValidators: true }
    );
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.status(200).json({ message: 'Company updated successfully', company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/companies/:id - Delete company
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;