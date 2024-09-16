const express = require("express");
const Article = require("../models/Article");
const User = require("../models/User");
const { isAuthenticated, isEditor } = require("../middlewares/auth");

const articleRoutes = (upload) => {
  const router = express.Router();

  // Submit an article
  router.post(
    "/submit",
    isAuthenticated,
    upload.single("file"),
    async (req, res) => {
      try {
        const article = await Article.create({
          title: req.body.title,
          abstract: req.body.abstract,
          file: req.file.filename, // Save the filename or path in your database
          authorId: req.user.id, // Sequelize uses id instead of _id
        });

        res.status(201).json(article);
      } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
      }
    }
  );
  router.put('/update', isAuthenticated, async (req, res) => {
    const { title, id, abstract } = req.body;
    try {
      const [updated] = await Article.update(
        { title, abstract },
        { where: { id } }
      );
      
      if (updated) {
        res.status(201).json({ success: true, message: 'Submission updated successfully!' });
      } else {
        res.status(200).json({ success: false, message: 'Submission was not modified!' });
      }
    } catch (err) {
      console.error(err);
      res.status(400).json('Failed to update submission');
    }
  });
  // Get articles for editor
  router.get("/all", isAuthenticated, isEditor, async (req, res) => {
    try {
      const articles = await Article.findAll({
        include: ['author', 'reviewers', 'feedback'],
      });
      res.status(200).json(articles);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });

    // Get articles for a specific author
    router.get("/mine", isAuthenticated, async (req, res) => {
      try {
        const articles = await Article.findAll({
          where: { authorId: req.user.id }
        });
        res.status(200).json(articles);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
    router.delete("/:id", async (req, res) => {
      try {
        const result = await Article.destroy({ where: { id: req.params.id } });
        res.json({ success: true, deletedCount: result });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
    // Assign a reviewer to a submission
    router.post("/:articleId/assign-reviewer", isAuthenticated, isEditor, async (req, res) => {
      try {
        const { reviewerId } = req.body;
        const article = await Article.findByPk(req.params.articleId);
        if (!article) {
          return res.status(404).json({ error: "Article not found" });
        }
  
        const reviewer = await User.findByPk(reviewerId);
        if (!reviewer) {
          return res.status(404).json({ error: "Reviewer not found" });
        }
  
        // Check if the reviewer is already assigned
        const alreadyAssigned = await article.hasReviewer(reviewer);
        if (alreadyAssigned) {
          res.status(304).json({ error: "Reviewer already assigned" });
        } else {
          await article.addReviewer(reviewer);
          res.status(200).json(article);
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
    // Update the status of a submission
    router.patch("/:articleId/status", isAuthenticated, isEditor, async (req, res) => {
      try {
        const { status } = req.body;
        const [updated] = await Article.update({ status }, { where: { id: req.params.articleId } });
  
        if (updated) {
          const updatedArticle = await Article.findByPk(req.params.articleId);
          res.status(200).json(updatedArticle);
        } else {
          res.status(404).json({ error: "Article not found" });
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
    // Get articles assigned to a specific reviewer
    router.get("/assigned/:reviewerId", isAuthenticated, async (req, res) => {
      try {
        const articles = await Article.findAll({
          include: [{ model: User, as: 'reviewers', where: { id: req.params.reviewerId } }]
        });
        res.status(200).json(articles);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
    return router
}
module.exports = articleRoutes;