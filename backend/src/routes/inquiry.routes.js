const express = require('express');
const InquiryController = require('../controllers/inquiry.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { inquiryValidation } = require('../validators/inquiry.validator');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.post('/', inquiryValidation, validate, InquiryController.createInquiry);
router.get('/my-inquiries', protect, InquiryController.getUserInquiries);

// Admin Routes
router.get('/admin/all', protect, authorize('admin'), InquiryController.getAllInquiries);
router.put('/admin/:id/status', protect, authorize('admin'), InquiryController.updateStatus);

module.exports = router;
