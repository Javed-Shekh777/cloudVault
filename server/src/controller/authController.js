const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Register
const registerManual = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const user = await User.create({ name, email, password });

    // generate token
    const token = user.generateAccessToken();

    // hide password in response
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
const loginManual = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await user.isPasswordCorrect(password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = user.generateAccessToken();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ token, user: safeUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { loginManual, registerManual };
