require("dotenv").config({
  path: require("find-config")(".env"),
});
const cron = require("node-cron");
const Website = require("../models/website.model");
const User = require("../models/user.model");
const axios = require("axios");
const { sendEmailAlert } = require("../services/notifications.service");
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI);

const checkHttpStatus = async (website) => {
  try {
    const response = await axios.get(website.url);
    return response.status === 200;
  } catch (err) {
    return false;
  }
};

const checkContent = async (website, content) => {
  try {
    const response = await axios.get(website.url);
    return response.data.includes(content);
  } catch (err) {
    return false;
  }
};

const checkSslExpiration = async (website) => {
  // Implement SSL certificate expiration check logic
  return true;
};

const checkPerformance = async (website) => {
  // Implement performance monitoring logic
  return { responseTime: 500 };
};

const monitorWebsites = async () => {
  const websites = await Website.find({ active: true });

  for (const website of websites) {
    const monitoringSettings = website.monitoringSettings;
    const notifications = website.notifications;

    let uptime = true;
    let responseTime;

    if (monitoringSettings.checks.httpStatus) {
      uptime = await checkHttpStatus(website);
    }

    if (monitoringSettings.checks.content && uptime) {
      const contentCheck = await checkContent(
        website,
        monitoringSettings.alertThresholds.missingContent
      );
      uptime = contentCheck;
    }

    if (monitoringSettings.checks.ssl && uptime) {
      const sslCheck = await checkSslExpiration(website);
      uptime = sslCheck;
    }

    if (monitoringSettings.checks.performance && uptime) {
      const performanceData = await checkPerformance(website);
      responseTime = performanceData.responseTime;

      if (
        monitoringSettings.alertThresholds.responseTime &&
        responseTime > monitoringSettings.alertThresholds.responseTime
      ) {
        uptime = false;

        if (notifications.email) {
          console.log("Sending email alert");
          const user = await User.findById(website.owner);
          console.log(user);
          const html = `Your website <strong>${website.name}</strong> is experiencing performance issues. Response time is ${responseTime}ms.`;
          sendEmailAlert(user.email, "Website Performance Alert", html);
        }
        if (notifications.sms) {
          // Send SMS notification
        }
        if (notifications.slack) {
          // Send Slack notification
        }
      }
    }

    // Save monitoring data to database
    website.monitoringHistory.push({
      timestamp: new Date(),
      uptime,
      responseTime,
    });
    await website.save();

    if (!uptime) {
      console.log(
        `Website ${website.name} is down. Sending notifications to owner.`
      );
    }
  }
};

// Schedule monitoring task to run every
cron.schedule("*/1 * * * *", () => {
  monitorWebsites();
  console.log("Monitoring task ran at", new Date());
});
