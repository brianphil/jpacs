const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Sequelize models
const { isAuthenticated, isEditor } = require('../middlewares/auth');
const { Op } = require('sequelize');

// Search for reviewers by name
router.get('/reviewers/search', isAuthenticated, isEditor, async (req, res) => {
  try {
    const { query } = req.query;

    const reviewers = await User.findAll({
      where: {
        role: 'reviewer',
        [Op.or]: [
          { firstName: { [Op.like]: `%${query}%` } },
          { lastName: { [Op.like]: `%${query}%` } }
        ],
      },
      attributes: ['firstName', 'lastName', 'id'] // Only select the required fields
    });

    res.status(200).json(reviewers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
