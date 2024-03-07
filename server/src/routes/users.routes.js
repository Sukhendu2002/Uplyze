const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const auth = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/roles.middleware");

// Get all users (admin only)
router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user information
router.put("/:id", auth, async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const query =
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.user._id };

    const user = await User.findOneAndUpdate(
      query,
      { name, email, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Change password
router.put("/:id/password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid current password" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
