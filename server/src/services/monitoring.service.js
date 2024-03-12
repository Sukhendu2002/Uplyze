const puppeteer = require("puppeteer");
const Website = require("../models/website.model");
const User = require("../models/user.model");
const axios = require("axios");
const { sendEmailAlert } = require("../services/notifications.service");
const checkHttpStatus = require("./monitoring/httpStatusMonitor");
const checkPerformance = require("./monitoring/performanceMonitor");
const checkSSL = require("./monitoring/ssl");
const ping = require("ping");

const getResponseTime = async (website) => {
  const start = Date.now();
  await axios.get(website.url);
  const end = Date.now();
  return end - start;
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

const monitorWebsites = async (websites) => {
  for (const website of websites) {
    console.log(`Monitoring website ${website.url}`);
    const monitoringSettings = website.monitoringSettings;
    const notifications = website.notifications;

    let uptime = true;
    let httpStatus;
    let performanceData;
    let responseTime;
    let ssl = website.info.ssl;

    if (monitoringSettings.checks.httpStatus) {
      console.log("Checking HTTP status");
      let res = await ping.promise.probe(website.url);

      const httpStatusCheck = await checkHttpStatus(website);
      uptime = httpStatusCheck.uptime;
      httpStatus = httpStatusCheck.httpStatus;
      if (uptime) {
        responseTime = await getResponseTime(website);
      } else {
        responseTime = 0;
      }
    }

    if (website.info.ssl.valid === false) {
      console.log("Checking SSL");
      const sslCheck = await checkSSL(website.url);
      ssl = sslCheck;
    }

    // if (uptime) {
    //   console.log("Checking Synthetic Monitoring");
    //   await performSyntheticMonitoring(website);
    // }

    if (monitoringSettings.checks.performance && uptime) {
      console.log("Checking Performance");
      performanceData = await checkPerformance(website);
    }

    website.monitoringHistory.push({
      timestamp: new Date(),
      uptime,
      responseTime,
      httpStatus,
      performance: performanceData,
    });
    website.info.ssl = ssl;
    await website.save();

    if (!uptime) {
      console.log(
        `Website ${website.name} is down. Sending notifications to owner.`
      );
    }
  }
};

module.exports = monitorWebsites;
