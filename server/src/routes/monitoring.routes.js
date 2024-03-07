const express = require("express");
const router = express.Router();
const Website = require("../models/website.model");
const auth = require("../middlewares/auth.middleware");

// Configure monitoring schedule and settings
router.put("/:id/settings", auth, async (req, res) => {
  const { monitoringSchedule, monitoringSettings, notifications } = req.body;

  try {
    const website = await Website.findOneAndUpdate(
      { _id: req.params.id, owner: req.user },
      { monitoringSchedule, monitoringSettings, notifications },
      { new: true }
    );
    if (!website) return res.status(404).json({ error: "Website not found" });
    res.json(website);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get monitoring data for a website
router.get("/:id/data", auth, async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      owner: req.user,
    });
    if (!website) return res.status(404).json({ error: "Website not found" });
    res.json(website.monitoringHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get uptime statistics for a website
router.get("/:id/uptime", auth, async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      owner: req.user,
    });
    if (!website) return res.status(404).json({ error: "Website not found" });

    const uptimeData = website.monitoringHistory.reduce(
      (acc, data) => {
        acc.totalCount++;
        if (data.uptime) acc.uptimeCount++;
        return acc;
      },
      { totalCount: 0, uptimeCount: 0 }
    );

    const uptimePercentage =
      (uptimeData.uptimeCount / uptimeData.totalCount) * 100;
    res.json({ uptimePercentage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
