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

const isEditor = async (req, res, next) => {
  const token =  req.header('Authorization');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    console.log("Decoded", req.user)
    if (req.user.role !== 'editor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { isAuthenticated, isEditor };
