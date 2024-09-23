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
    // upload.single("file"),
    async (req, res) => {
      console.log("Body", req.body)
      const file = req.body.file
      try {
        const article = new Article({
          title: req.body.title,
          abstract: req.body.abstract,
          file, // Save the filename or path in your database
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
      const credentials = base64.encode(
        `${process.env.WP_USERNAME}:${process.env.WP_APP_PASSWORD}`
      );

      // Fetch the current author from MongoDB
      const currentAuthor = await User.findOne({ _id: article.author });
      // WordPress expects an author ID, so you should either find or create the author in WordPress
      const wpAuthorId = await getOrCreateWpAuthor(currentAuthor, credentials);

      // Make the request to publish the article
      const response = await axios.post(
        process.env.WP_API_URL + "/posts",
        {
          title: article.title,
          content: `
          <h2>Abstract:</h2>
          <p>${article.abstract}</p>
          <a href="https://jpacs-api.onrender.com/uploads/${article.file}" download>Download Article</a>
        `,
          author: wpAuthorId, // Use the WordPress user ID for the author
          status: "publish",
          categories: [4], // Replace with the "Publications" category ID from WordPress
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

  // Helper function to create or get the WordPress author
  async function getOrCreateWpAuthor(mongoUser, credentials) {
    try {
      // Check if the author already exists in WordPress by email
      const existingUserResponse = await axios.get(
        `${process.env.WP_API_URL}/users?search=${mongoUser.email}`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );

      if (existingUserResponse.data.length > 0) {
        // Return the WordPress user ID if found
        return existingUserResponse.data[0].id;
      }

      // If not found, create a new author in WordPress
      const newUserResponse = await axios.post(
        `${process.env.WP_API_URL}/users`,
        {
          username: mongoUser.username,
          email: mongoUser.email,
          name: `${mongoUser.firstName} ${mongoUser.lastName}`,
          password: "DefaultPassword123!", // You may want to generate a password or handle this securely
          roles: ["author"], // Assign the 'author' role
        },
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Return the newly created WordPress user ID
      return newUserResponse.data.id;
    } catch (error) {
      console.error("Failed to get or create WordPress author:", error);
      throw new Error("Error managing WordPress author");
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
      await Article.findOneAndUpdate({_id: req.params.articleId}, {$set:{isApproved: true}})
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
