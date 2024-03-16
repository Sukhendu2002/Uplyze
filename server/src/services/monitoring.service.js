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
      const sslCheck = await checkSSL(website.url);
      ssl = sslCheck;
    }

    if (monitoringSettings.checks.performance && uptime) {
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
    if (
      responseTime > website.monitoringSettings.alertThresholds.responseTime
    ) {
      if (notifications?.email) {
        const user = await User.findById(website.owner);
        sendEmailAlert(
          user.email,
          "Website Slow",
          `
          <h1>Hello ${user.name}</h1>
          <p>Your website ${
            website.name
          } is slow. Response time: ${responseTime}ms</p>
          <p>Current time: ${new Date()}</p>
          `
        );
        console.log(
          `Website ${website.name} is slow. Sending notifications to owner.`
        );
      }
    }
    if (notifications.email && !uptime) {
      const user = await User.findById(website.owner);
      sendEmailAlert(
        user.email,
        "Website Down",
        ` <h1>Hello ${user.name}</h1>
        <p>Your website ${website.name} is down.</p>
        <p>Current time: ${new Date()}</p>
        `
      );
      console.log(
        `Website ${website.name} is down. Sending notifications to owner.`
      );
    }
  }
};

module.exports = monitorWebsites;
