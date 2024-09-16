const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Sequelize models
const Article= require('../models/Article'); // Sequelize models
const User = require('../models/User'); // Sequelize models
const { isAuthenticated } = require('../middlewares/auth');

// Create a new review
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { article, reviewer, content, rating } = req.body;

    // Check if the reviewer is assigned to the article
    const articleDoc = await Article.findByPk(article, {
      include: [{ model: User, as: 'reviewers', attributes: ['id'] }] // Include reviewers for this article
    });

    if (!articleDoc || !articleDoc.reviewers.some(r => r.id === reviewer)) {
      return res.status(403).json({ error: 'You are not assigned to review this article.' });
    }

    // Create a new review
    const review = await Review.create({
      articleId: article,
      reviewerId: reviewer,
      content,
      rating
    });

    // Add the review to the article's feedback array
    await articleDoc.addFeedback(review); // Assuming there is an association for feedback
    await articleDoc.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all reviews for a specific article
router.get('/article/:articleId', isAuthenticated, async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { articleId: req.params.articleId },
      include: [{ model: User, as: 'reviewer', attributes: ['firstName', 'lastName'] }]
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific review
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [{ model: User, as: 'reviewer', attributes: ['firstName', 'lastName'] }]
    });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
