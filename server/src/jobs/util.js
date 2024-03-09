const Website = require("../models/website.model");

const getWebsitesToMonitor = async (frequency) => {
  try {
    const websites = await Website.find({
      "monitoringSchedule.frequency": frequency,
      active: true,
    });
    return websites;
  } catch (err) {
    console.error(`Error fetching websites for ${frequency} frequency:`, err);
    return [];
  }
};

module.exports = getWebsitesToMonitor;
