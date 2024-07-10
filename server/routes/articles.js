const express = require('express');
const Article = require('../models/Article');
const { isAuthenticated, isEditor } = require('../middlewares/auth');

const articleRoutes = (upload) => {
  const router = express.Router();

  // Submit an article
  router.post('/submit', isAuthenticated, upload.single('file'), async (req, res) => {
    try {
      const article = new Article({
        title: req.body.title,
        abstract: req.body.abstract,
        file: req.file.filename, // Save the filename or path in your database
        author: req.user._id,
      });

      await article.save();
      res.status(201).json(article);
    } catch (error) {
      console.error(error.message);
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
  router.get('/mine/', isAuthenticated, async (req, res) => {
    try {
      const articles = await Article.find({ author: req.user._id});
      res.status(200).json(articles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.delete('/:id', async (req, res)=>{
    const articleId = req.params.id;
    const result = await Article.deleteOne({_id: articleId})
    res.json(result)
  })

  return router;
};

module.exports = articleRoutes;
