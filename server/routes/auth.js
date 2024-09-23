const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User  = require("../models/User"); 
const { isAuthenticated, isEditor } = require("../middlewares/auth"); // Import isAuthenticated middleware
const {ObjectId} = require('mongodb')
// Register
router.post("/register", async (req, res) => {
  const { username, password, role, firstName, lastName, email, affiliation, bio } = req.body;
  try {
    let user = await User.findOne({  username });
    if (user) return res.status(400).json({ message: "Username already exists" });

    user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // const hashedPassword = await bcrypt.hash(password, 10);
    const isApproved = role === "author";

    user = await User.create({
      username,
      password,
      role,
      firstName,
      lastName,
      email,
      affiliation,
      bio,
      isApproved,
    });

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Generate JWT
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      // Respond with token and user details
      res.json({ token, user });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", err });
  }
});
// Approve user
router.post("/approve/:userId", isAuthenticated, isEditor, async (req, res) => {
  try {
    const { userId } = req.params;
    const updated = await User.updateOne({ _id: new ObjectId(userId)  }, { $set: {isApproved: true} });

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User approved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Fetch users pending approval
router.get("/pending", isAuthenticated, isEditor, async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false});
    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Get current user
router.get("/user", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
// Logout route
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
