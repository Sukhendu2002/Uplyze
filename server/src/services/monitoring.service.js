require("dotenv").config({
  path: require("find-config")(".env"),
});
const cron = require("node-cron");
const puppeteer = require("puppeteer");
const Website = require("../models/website.model");
const User = require("../models/user.model");
const axios = require("axios");
const { sendEmailAlert } = require("../services/notifications.service");
const mongoose = require("mongoose");

const checkHttpStatus = require("./monitoring/httpStatusMonitor");

mongoose.connect(process.env.DB_URI);

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

// Function to perform synthetic monitoring
const performSyntheticMonitoring = async (website) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(website.url, { waitUntil: "networkidle0" });

  const issues = await page.evaluate(() => {
    const issues = [];
    const elements = document.querySelectorAll("img, script, link");

    elements.forEach((element) => {
      if (element.tagName === "IMG") {
        if (!element.complete) {
          issues.push(`Image ${element.src} did not load`);
        }
      } else if (element.tagName === "SCRIPT") {
        if (!element.complete) {
          issues.push(`Script ${element.src} did not load`);
        }
      } else if (element.tagName === "LINK") {
        if (element.rel === "stylesheet" && !element.complete) {
          issues.push(`Stylesheet ${element.href} did not load`);
        }
      }
    });

    return issues;
  });

  if (issues) {
    console.log("Website has issues", issues);
    // Send notifications

    if (website.notifications.email) {
      const user = await User.findById(website.owner);
      const html = `Your website <strong>${
        website.name
      }</strong> has issues: ${issues.join(", ")}`;
      sendEmailAlert(user.email, "Website Issues Alert", html);
    }
  }

  await browser.close();
};

const monitorWebsites = async () => {
  const websites = await Website.find({ active: true });

  for (const website of websites) {
    console.log(`Monitoring website ${website.url}`);
    const monitoringSettings = website.monitoringSettings;
    const notifications = website.notifications;

    let uptime = true;
    let responseTime;

    if (monitoringSettings.checks.httpStatus) {
      console.log("Checking HTTP status");
      const httpStatusCheck = await checkHttpStatus(website);
      console.log(httpStatusCheck);
    }

    // if (monitoringSettings.checks.content && uptime) {
    //   const contentCheck = await checkContent(
    //     website,
    //     monitoringSettings.alertThresholds.missingContent
    //   );
    //   uptime = contentCheck;
    // }

    // if (monitoringSettings.checks.ssl && uptime) {
    //   const sslCheck = await checkSslExpiration(website);
    //   uptime = sslCheck;
    // }

    // if (monitoringSettings.checks.performance && uptime) {
    //   const performanceData = await checkPerformance(website);
    //   responseTime = performanceData.responseTime;

    //   if (
    //     monitoringSettings.alertThresholds.responseTime &&
    //     responseTime > monitoringSettings.alertThresholds.responseTime
    //   ) {
    //     uptime = false;

    //     if (notifications.email) {
    //       console.log("Sending email alert");
    //       const user = await User.findById(website.owner);
    //       console.log(user);
    //       const html = `Your website <strong>${website.name}</strong> is experiencing performance issues. Response time is ${responseTime}ms.`;
    //       sendEmailAlert(user.email, "Website Performance Alert", html);
    //     }
    //     if (notifications.sms) {
    //       // Send SMS notification
    //     }
    //     if (notifications.slack) {
    //       // Send Slack notification
    //     }
    //   }
    // }

    // if (monitoringSettings.checks.syntheticMonitoring) {
    //   await performSyntheticMonitoring(website);
    // }

    // // Save monitoring data to database
    // website.monitoringHistory.push({
    //   timestamp: new Date(),
    //   uptime,
    //   responseTime,
    // });
    // await website.save();

    // if (!uptime) {
    //   console.log(
    //     `Website ${website.name} is down. Sending notifications to owner.`
    //   );
    // }
  }
};

// Schedule monitoring task to run every
cron.schedule("*/1 * * * *", () => {
  monitorWebsites();
  console.log("Monitoring task ran at", new Date());
});
