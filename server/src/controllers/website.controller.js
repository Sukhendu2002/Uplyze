const Website = require("../models/website.model");

const createWebsite = async (req, res) => {
  const { name, url, monitoringSchedule, monitoringSettings } = req.body;

  try {
    const website = new Website({
      name,
      url,
      owner: req.user,
      monitoringSchedule,
      monitoringSettings,
    });
    await website.save();
    res.status(201).json(website);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getWebsites = async (req, res) => {
  try {
    const websites = await Website.find({ owner: req.user });
    res.json(websites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      owner: req.user,
    });
    if (!website) return res.status(404).json({ error: "Website not found" });
    res.json(website);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateWebsite = async (req, res) => {
  const { name, url, active, monitoringSchedule, monitoringSettings } =
    req.body;

  try {
    const website = await Website.findOneAndUpdate(
      { _id: req.params.id, owner: req.user },
      { name, url, active, monitoringSchedule, monitoringSettings },
      { new: true }
    );
    if (!website) return res.status(404).json({ error: "Website not found" });
    res.json(website);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteWebsite = async (req, res) => {
  try {
    const website = await Website.findOneAndDelete({
      _id: req.params.id,
      owner: req.user,
    });
    if (!website) return res.status(404).json({ error: "Website not found" });
    res.json({ message: "Website deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createWebsite,
  getWebsites,
  getWebsiteById,
  updateWebsite,
  deleteWebsite,
};
