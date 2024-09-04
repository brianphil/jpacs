const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated, isEditor } = require('../middlewares/auth');

// Search for reviewers by name
router.get('/reviewers/search', isAuthenticated, isEditor, async (req, res) => {
  try {
    const { query } = req.query;
    const reviewers = await User.find({
      role: 'reviewer',
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
      ],
    }).select('firstName lastName _id');
    res.status(200).json(reviewers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
