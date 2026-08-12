const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.error(res, 'Authentication token missing or invalid.', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return ApiResponse.error(res, 'User associated with token no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Not authorized, token validation failed.', 401);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this route.`,
        403
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
