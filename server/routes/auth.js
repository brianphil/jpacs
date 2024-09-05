const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isAuthenticated, isEditor } = require("../middlewares/auth"); // Import isAuthenticated middleware

// Register
router.post("/register", async (req, res) => {
  const { username, password, role, firstName, lastName, email, affiliation, bio } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: "Username already exists" });

    user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });
    const isApproved = role == "author" ? true : false;
    user = new User({
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
    await user.save();

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
    if (user) {
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Generate JWT
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        // Respond with token and user details
        res.json({ token, user });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user
router.get("/user", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
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
  // Simply respond with a success message, the client should handle the token removal
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
