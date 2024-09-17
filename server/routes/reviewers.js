const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated, isEditor } = require('../middlewares/auth');

// Search for reviewers by name
router.get('/reviewers/search', isEditor, async (req, res) => {
  try {
    const { query } = req.query;
    const reviewers = await User.find({
      role: 'reviewer',
      $or: [
        { firstName: { $regex: query, $options: 'ig' } },
        { lastName: { $regex: query, $options: 'ig' } },
        { username: { $regex: query, $options: 'ig' } },
      ],
    }, { firstName: 1, lastName: 1, _id: 1 });
    res.status(200).json(reviewers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
