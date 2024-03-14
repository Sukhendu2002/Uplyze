const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { sendEmailAlert } = require("../services/notifications.service");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({
      email,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({
        success: false,
        error: "Invalid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password should be at least 6 characters",
      });
    }

    const user = new User({ name, email, password });
    await user.save();
    await sendEmailAlert(
      email,
      "Welcome to Uplyze!",
      `<p>Hi ${name},</p>
      <p>Thank you for signing up for Uplyze. We are excited to have you on board.</p>
      <p>Best,</p>
      <p>Team Uplyze</p>`
    );
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = { signup, login };
