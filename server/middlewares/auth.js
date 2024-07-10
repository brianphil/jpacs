const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
  const token =  req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const isEditor = (req, res, next) => {
  if (req.user.role !== 'author') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { isAuthenticated, isEditor };
