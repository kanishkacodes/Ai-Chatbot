import express from "express";
import passport from "passport";
import User from "../models/User.models.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Request received at /register:", req.body);
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    return res.status(201).json({
      message: "User registered successfully",
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    console.error(error);

    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      if (error.keyPattern?.username) {
        return res.status(400).json({ message: "This username is already taken. Please choose another one." });
      }
      if (error.keyPattern?.email) {
        return res.status(400).json({ message: "An account with this email already exists." });
      }
    }

    // Default error handler
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});

  

// Login route
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({
    message: "Login successful",
    user: {
      username: req.user.username,
      email: req.user.email,
    },
  });
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

export default router;
