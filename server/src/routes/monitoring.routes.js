const express = require("express");
const router = express.Router();
const Website = require("../models/website.model");
const auth = require("../middlewares/auth.middleware");

// Configure monitoring schedule and settings
router.put("/:id/settings", auth, async (req, res) => {
  const { monitoringSchedule, monitoringSettings } = req.body;

  try {
    const website = await Website.findOneAndUpdate(
      { _id: req.params.id, owner: req.user },
      { monitoringSchedule, monitoringSettings },
      { new: true }
    );
    if (!website) return res.status(404).json({ error: "Website not found" });
    res.json(website);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
