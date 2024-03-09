const axios = require("axios");
const { URL } = require("url");
const puppeteer = require("puppeteer");

const checkPerformance = async (website) => {
  const { url } = website;

  try {
    new URL(url);
  } catch (error) {
    return {
      ttfb: null,
      fcp: null,
      domLoad: null,
    };
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    const performance = await page.evaluate(() => {
      return {
        ttfb:
          window.performance.timing.responseStart -
          window.performance.timing.requestStart,
        fcp:
          window.performance.timing.domInteractive -
          window.performance.timing.navigationStart,
        domLoad:
          window.performance.timing.domContentLoadedEventEnd -
          window.performance.timing.navigationStart,
      };
    });
    await browser.close();

    return {
      ttfb: performance.ttfb,
      fcp: performance.fcp,
      domLoad: performance.domLoad,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      ttfb: null,
      fcp: null,
      domLoad: null,
    };
  }
};

module.exports = checkPerformance;
