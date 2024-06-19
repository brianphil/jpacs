const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { isAuthenticated, isEditor } = require('../middlewares/auth');

// Submit an article
router.post('/submit', isAuthenticated, async (req, res) => {
  try {
    const article = new Article({
      ...req.body,
      author: req.user._id
    });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get articles for editor
router.get('/all', isEditor, async (req, res) => {
  try {
    const articles = await Article.find().populate('author reviewers feedback');
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get articles for a specific author
router.get('/mine', isAuthenticated, async (req, res) => {
  try {
    const articles = await Article.find({ author: req.user._id });
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
