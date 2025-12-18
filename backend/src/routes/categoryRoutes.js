const express = require('express');
const ServiceCategory = require('../models/ServiceCategory');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

const router = express.Router();

// Get all categories (public)
router.get('/', asyncHandler(async (req, res) => {
  const categories = await ServiceCategory.find().sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, categories, 'Categories fetched successfully'));
}));

// Create category (admin only)
router.post('/', authMiddleware, roleCheck('ADMIN'), asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;
  
  const existingCategory = await ServiceCategory.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ success: false, message: 'Category already exists' });
  }

  const category = new ServiceCategory({ name, description, isActive });
  await category.save();
  
  res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
}));

// Update category (admin only)
router.patch('/:id', authMiddleware, roleCheck('ADMIN'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, isActive } = req.body;

  const category = await ServiceCategory.findByIdAndUpdate(
    id,
    { name, description, isActive },
    { new: true, runValidators: true }
  );

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
}));

// Delete category (admin only)
router.delete('/:id', authMiddleware, roleCheck('ADMIN'), asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await ServiceCategory.findByIdAndDelete(id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
}));

module.exports = router;
