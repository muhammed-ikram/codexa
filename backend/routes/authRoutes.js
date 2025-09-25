const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");
const  sendWelcomeEmail  = require("../middlewares/sendMail");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username,email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username,email, password: hashedPassword, role });
    await newUser.save();
    sendWelcomeEmail(email, username);

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET || "yourSecretKey",
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin in production
        maxAge: 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === 'production' ? undefined : undefined, // let browser handle domain
      })
      .json({ 
        message: "User registered successfully",
        user: { id: newUser._id, username: newUser.username, role: newUser.role },
        token: token
      });

    // res.status(201).json("User registered successfully");
  } catch (err) {
    res.status(500).json("Server error");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "yourSecretKey",
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin in production
        maxAge: 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === 'production' ? undefined : undefined, // let browser handle domain
      })
      .json({ 
        message: "Login successful",
        user: { id: user._id, username: user.username, role: user.role },
        token: token
      });
  } catch (err) {
    res.status(500).json("Server error");
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json("Logged out");
});

// Profile
router.get("/profile", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
