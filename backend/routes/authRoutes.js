const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/authMiddleware");

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

    res.status(201).json("User registered successfully");
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
      "yourSecretKey",
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // change to true in production with HTTPS
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful",user: { id: user._id, username: user.username, role: user.role } });
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
