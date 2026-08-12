const express = require('express');
const CategoryController = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.post('/', protect, authorize('admin'), CategoryController.createCategory);
router.put('/:id', protect, authorize('admin'), CategoryController.updateCategory);
router.delete('/:id', protect, authorize('admin'), CategoryController.deleteCategory);

module.exports = router;
