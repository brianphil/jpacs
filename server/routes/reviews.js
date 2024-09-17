const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Article = require('../models/Article');
const { isAuthenticated } = require('../middlewares/auth');

// Create a new review
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { article, reviewer, content, rating } = req.body;

    // Check if the reviewer is assigned to the article
    const articleDoc = await Article.findById(article);
    if (!articleDoc || !articleDoc.reviewers.includes(reviewer)) {
      return res.status(403).json({ error: 'You are not assigned to review this article.' });
    }

    const review = new Review({
      article,
      reviewer,
      content,
      rating
    });

    await review.save();

    // Add the review to the article's feedback array
    articleDoc.feedback.push(review._id);
    await articleDoc.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all reviews for a specific article
router.get('/article/:articleId', isAuthenticated, async (req, res) => {
  try {
    const reviews = await Review.find({ article: req.params.articleId }).populate('reviewer', 'firstName lastName');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific review
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('reviewer', 'firstName lastName');
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
