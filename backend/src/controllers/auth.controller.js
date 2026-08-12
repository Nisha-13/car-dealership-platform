const AuthService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.registerUser(req.body);
      return ApiResponse.success(res, result, 'Registration successful', 201);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginUser(email, password);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.getUserProfile(req.user._id);
      return ApiResponse.success(res, user, 'Profile retrieved');
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const updatedUser = await AuthService.updateProfile(req.user._id, req.body);
      return ApiResponse.success(res, updatedUser, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
