const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const appEvents = require('../events/appEvents');
const eventTypes = require('../events/eventTypes');
const InquiryService = require('./inquiry.service');

class AuthService {
  static generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  static async registerUser(userData) {
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      const error = new Error('An account with this email address already exists.');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'customer',
      phone: userData.phone || ''
    });

    const token = this.generateToken(user);

    // Link any guest inquiries to the newly registered user
    try {
      const linkedCount = await InquiryService.linkGuestInquiriesToUser(user._id, user.email);
      if (linkedCount > 0) {
        console.log(`Linked ${linkedCount} guest inquiries to user ${user.email}`);
      }
    } catch (err) {
      // Don't fail registration if linking fails, just log it
      console.error('Error linking guest inquiries:', err.message);
    }

    appEvents.emit(eventTypes.USER_REGISTERED, {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt || new Date()
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      },
      token
    };
  }

  static async loginUser(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);

    // Link any guest inquiries to the logged-in user
    try {
      const linkedCount = await InquiryService.linkGuestInquiriesToUser(user._id, user.email);
      if (linkedCount > 0) {
        console.log(`Linked ${linkedCount} guest inquiries to user ${user.email}`);
      }
    } catch (err) {
      // Don't fail login if linking fails, just log it
      console.error('Error linking guest inquiries:', err.message);
    }

    appEvents.emit(eventTypes.USER_LOGGED_IN, {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      loginTime: new Date()
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      },
      token
    };
  }

  static async getUserProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User profile not found.');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  static async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User profile not found.');
      error.statusCode = 404;
      throw error;
    }

    if (updateData.name) user.name = updateData.name;
    if (updateData.phone) user.phone = updateData.phone;
    if (updateData.notificationPreferences) {
      user.notificationPreferences = { ...user.notificationPreferences, ...updateData.notificationPreferences };
    }

    await user.save();
    return user;
  }
}

module.exports = AuthService;
