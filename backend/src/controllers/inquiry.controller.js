const InquiryService = require('../services/inquiry.service');
const ApiResponse = require('../utils/apiResponse');

class InquiryController {
  static async createInquiry(req, res, next) {
    try {
      const userId = req.user ? req.user._id : null;
      const inquiry = await InquiryService.createInquiry(req.body, userId);
      return ApiResponse.success(res, inquiry, 'Inquiry submitted successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async getUserInquiries(req, res, next) {
    try {
      const inquiries = await InquiryService.getUserInquiries(req.user._id, req.user.email);
      return ApiResponse.success(res, inquiries, 'User inquiries retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async getAllInquiries(req, res, next) {
    try {
      const inquiries = await InquiryService.getAllInquiries(req.query.status);
      return ApiResponse.success(res, inquiries, 'All inquiries retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { status, dealerResponse } = req.body;
      const inquiry = await InquiryService.updateInquiryStatus(req.params.id, status, dealerResponse);
      return ApiResponse.success(res, inquiry, 'Inquiry updated successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = InquiryController;
