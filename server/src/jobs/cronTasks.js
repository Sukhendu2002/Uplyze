require("dotenv").config({
  path: require("find-config")(".env"),
});
const cron = require("node-cron");
const getWebsitesToMonitor = require("./util");
const mongoose = require("mongoose");
const monitorWebsites = require("../services/monitoring.service");

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Connected to the database");
    // 15 minutes cron task
    cron.schedule("*/15 * * * *", async () => {
      const websites = await getWebsitesToMonitor("15m");
      await monitorWebsites(websites);
    });

    // 30 minutes cron task
    cron.schedule("*/30 * * * *", async () => {
      const websites = await getWebsitesToMonitor("30m");
      await monitorWebsites(websites);
    });

    // Hourly cron task
    cron.schedule("0 * * * *", async () => {
      const websites = await getWebsitesToMonitor("hourly");
      await monitorWebsites(websites);
    });

    // Daily cron task
    cron.schedule("0 0 * * *", async () => {
      const websites = await getWebsitesToMonitor("daily");
      await monitorWebsites(websites);
    });

    // Weekly cron task
    cron.schedule("0 0 * * 0", async () => {
      const websites = await getWebsitesToMonitor("weekly");
      await monitorWebsites(websites);
    });

    // Monthly cron task
    cron.schedule("0 0 1 * *", async () => {
      const websites = await getWebsitesToMonitor("monthly");
      await monitorWebsites(websites);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });
