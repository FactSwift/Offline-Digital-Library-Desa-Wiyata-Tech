const jwt = require('jsonwebtoken');
const { User } = require('../models');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'offline_digital_library_secret';

const auth = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
auth.admin = async function(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized as admin' });
    }
    
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = auth; 