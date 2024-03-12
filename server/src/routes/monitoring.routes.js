const express = require("express");
const router = express.Router();
const Website = require("../models/website.model");
const auth = require("../middlewares/auth.middleware");
const checkSSL = require("../services/monitoring/ssl");
const {
  getDomainInfo,
  parseWhoisData,
} = require("../services/monitoring/domain");

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

router.get("/:id/ssl", auth, async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      owner: req.user,
    });
    if (!website) return res.status(404).json({ error: "Website not found" });

    const sslData = await checkSSL(website.url);
    res.json(sslData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/domain", auth, async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      owner: req.user,
    });
    if (!website) return res.status(404).json({ error: "Website not found" });
    const domainData = await getDomainInfo(website.url);

    res.json(domainData);
  } catch (err) {
    res.status(500).json({
      valid: false,
      extra: {
        message: err.message,
        stack: err.stack,
      },
    });
  }
});

module.exports = router;
