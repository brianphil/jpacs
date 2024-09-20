const express = require("express");
const Article = require("../models/Article");
const User = require("../models/User");
const { isAuthenticated, isEditor } = require("../middlewares/auth");
const ObjectId = require("mongoose").Types.ObjectId;
const axios = require("axios");
const base64 = require("base-64");
const WP_API_URL = process.env.WP_API_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;
const articleRoutes = (upload) => {
  const router = express.Router();

  // Submit an article
  router.post(
    "/submit",
    isAuthenticated,
    upload.single("file"),
    async (req, res) => {
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
    }
  );

  // Function to publish an article to WordPress
  async function publishArticleToWordPress(article) {
    try {
      const credentials = base64.encode(`${WP_USERNAME}:${WP_APP_PASSWORD}`);
      const response = await axios.post(
        WP_API_URL,
        {
          title: article.title,
          content: `
          <h2>Abstract:</h2>
          <p>${article.abstract}</p>
          <a href="${article.file}" download>Download Article</a>
        `,
          status: "publish",
          categories: 4, // Replace with the "Publications" category ID from WordPress
        },
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to publish article to WordPress:", error);
      throw new Error("Error publishing article to WordPress");
    }
  }

  router.put("/update", isAuthenticated, async (req, res) => {
    const { title, _id, abstract } = req.body;
    try {
      console.log(_id);
      const article = await Article.updateOne(
        { _id: new ObjectId(_id.toString()) },
        { $set: { title: title, abstract: abstract } }
      );
      console.log(article);
      if (article.modifiedCount > 0) {
        res
          .status(201)
          .json({ success: true, message: "Submission updated successfully!" });
      } else {
        res
          .status(200)
          .json({ success: false, message: "Submission was not modified!" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json("Failed to update submission");
    }
  });

  // Get articles for editor
  router.get("/all", async (req, res) => {
    try {
      const articles = await Article.find().populate(
        "author reviewers feedback"
      );
      res.status(200).json(articles);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });

  // Get articles for a specific author
  router.get("/mine/", isAuthenticated, async (req, res) => {
    try {
      const articles = await Article.find({ author: req.user._id });
      res.status(200).json(articles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.delete("/:id", async (req, res) => {
    const articleId = req.params.id;
    const result = await Article.deleteOne({ _id: articleId });
    res.json(result);
  });
  // Add this route in your articles.js file
  router.get("/:submissionId", isAuthenticated, async (req, res) => {
    try {
      const submission = await Article.findById(req.params.submissionId)
        .populate("author", "firstName lastName email")
        .populate("reviewers", "firstName lastName email")
        .populate({
          path: "feedback",
          populate: {
            path: "reviewer",
            select: "firstName lastName email",
          },
        });

      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.status(200).json(submission);
    } catch (error) {
      console.error("Error fetching submission:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // Get articles assigned to a specific reviewer
  router.get("/assigned/:reviewerId", isAuthenticated, async (req, res) => {
    try {
      const articles = await Article.find({
        reviewers: req.params.reviewerId,
      }).populate("author reviewers feedback");
      res.status(200).json(articles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all submissions (for editors)
  // router.get("/all", isAuthenticated, isEditor, async (req, res) => {
  //   try {
  //     const articles = await Article.find().populate(
  //       "author reviewers feedback"
  //     );
  //     res.status(200).json(articles);
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // });

  // Assign a reviewer to a submission
  router.post(
    "/:articleId/assign-reviewer",
    isAuthenticated,
    isEditor,
    async (req, res) => {
      try {
        const { reviewerId } = req.body;
        const article = await Article.findById(req.params.articleId);
        if (!article) {
          return res.status(404).json({ error: "Article not found" });
        }

        const reviewer = await User.findById(reviewerId.toString());
        if (!reviewer) {
          return res.status(404).json({ error: "Reviewer not found" });
        }
        if (article.reviewers.includes(reviewer._id.toString())) {
          res.status(304).json({ error: "Reviewer already assigned" });
        } else {
          article.reviewers.push(reviewer._id);
          await article.save();
          res.status(200).json(article);
        }
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Update the status of a submission
  router.patch(
    "/:articleId/status",
    isAuthenticated,
    isEditor,
    async (req, res) => {
      try {
        const { status } = req.body;
        const article = await Article.findById(req.params.articleId);

        if (!article) {
          return res.status(404).json({ error: "Article not found" });
        }

        article.status = status;
        await article.save();

        res.status(200).json(article);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  );
   // Assuming this is your route for approving an article
   router.post("/:articleId/approve", async (req, res) => {
    try {
      const article = await Article.findById(req.params.articleId);
      if (!article)
        return res.status(404).json({ message: "Article not found" });

      // Approve the article
      article.isApproved = true;
      await article.save();

      // Publish the article to WordPress
      await publishArticleToWordPress(article);

      res.status(200).json({ message: "Article approved and published" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

module.exports = articleRoutes;
