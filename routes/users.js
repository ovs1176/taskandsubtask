const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const SECRET_KEY = "ASDFGHJKL1234ZXCVBNM0987QWERTYUIOP456789";

// User registration route
router.post("/register", async (req, res) => {
  try {
    const { email, name } = req.body;

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // User with the given email already exists
      return res
        .status(409)
        .json({ error: "User with the given email already exists" });
    }

    const newUser = new User({
      email,
      name
    });

    const savedUser = await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "user with this email doesn't exist. " });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
